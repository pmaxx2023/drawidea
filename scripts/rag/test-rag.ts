/**
 * MVP RAG over FHIR IGs
 *
 * 1. Fetch key IG pages from build.fhir.org
 * 2. Chunk the content
 * 3. Use Gemini embeddings to create vectors
 * 4. On query, find relevant chunks
 * 5. Inject into prompt
 */

import { GoogleGenAI } from '@google/genai';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('Set GOOGLE_API_KEY environment variable');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

// Key IG documentation URLs to index
const IG_SOURCES = [
  // Da Vinci PDex
  'https://build.fhir.org/ig/HL7/davinci-epdx/index.html',
  'https://build.fhir.org/ig/HL7/davinci-epdx/usecases.html',
  'https://build.fhir.org/ig/HL7/davinci-epdx/workflow.html',

  // Da Vinci PAS
  'https://build.fhir.org/ig/HL7/davinci-pas/index.html',
  'https://build.fhir.org/ig/HL7/davinci-pas/usecases.html',

  // US Core
  'https://build.fhir.org/ig/HL7/US-Core/index.html',

  // CARIN BB
  'https://build.fhir.org/ig/HL7/carin-bb/index.html',
];

interface Chunk {
  content: string;
  source: string;
  embedding?: number[];
}

// Simple HTML to text extraction
function htmlToText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Chunk text into ~500 char segments with overlap
function chunkText(text: string, source: string): Chunk[] {
  const chunks: Chunk[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);

  let currentChunk = '';
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > 500) {
      if (currentChunk.trim()) {
        chunks.push({ content: currentChunk.trim(), source });
      }
      // Overlap: keep last 100 chars
      currentChunk = currentChunk.slice(-100) + ' ' + sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({ content: currentChunk.trim(), source });
  }

  return chunks;
}

// Fetch and chunk a URL
async function fetchAndChunk(url: string): Promise<Chunk[]> {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`  Failed: ${response.status}`);
      return [];
    }
    const html = await response.text();
    const text = htmlToText(html);
    const chunks = chunkText(text, url);
    console.log(`  Got ${chunks.length} chunks`);
    return chunks;
  } catch (error) {
    console.log(`  Error: ${error}`);
    return [];
  }
}

// Get embedding for text using Gemini
async function getEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ parts: [{ text }] }],
  });
  return response.embeddings?.[0]?.values || [];
}

// Cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Find top K most relevant chunks
function findRelevantChunks(query: number[], chunks: Chunk[], k: number = 5): Chunk[] {
  const scored = chunks
    .filter(c => c.embedding)
    .map(chunk => ({
      chunk,
      score: cosineSimilarity(query, chunk.embedding!),
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k).map(s => s.chunk);
}

async function main() {
  console.log('=== FHIR IG RAG MVP ===\n');

  // Step 1: Fetch and chunk all sources
  console.log('Step 1: Fetching IG content...\n');
  const allChunks: Chunk[] = [];

  for (const url of IG_SOURCES) {
    const chunks = await fetchAndChunk(url);
    allChunks.push(...chunks);
  }

  console.log(`\nTotal chunks: ${allChunks.length}\n`);

  if (allChunks.length === 0) {
    console.log('No chunks fetched. Check network/URLs.');
    return;
  }

  // Step 2: Embed all chunks
  console.log('Step 2: Embedding chunks...\n');
  let embedded = 0;
  for (const chunk of allChunks) {
    try {
      chunk.embedding = await getEmbedding(chunk.content);
      embedded++;
      if (embedded % 10 === 0) {
        console.log(`  Embedded ${embedded}/${allChunks.length}`);
      }
    } catch (error) {
      console.log(`  Embedding failed for chunk: ${error}`);
    }
  }
  console.log(`\nEmbedded ${embedded} chunks\n`);

  // Step 3: Test queries
  const testQueries = [
    'payer to payer data exchange workflow',
    'prior authorization submission',
    'patient access to claims data',
    'provider access API attribution',
  ];

  console.log('Step 3: Testing queries...\n');

  for (const query of testQueries) {
    console.log(`\nQuery: "${query}"`);
    console.log('-'.repeat(50));

    const queryEmbedding = await getEmbedding(query);
    const relevant = findRelevantChunks(queryEmbedding, allChunks, 3);

    for (let i = 0; i < relevant.length; i++) {
      const chunk = relevant[i];
      console.log(`\n[${i + 1}] Source: ${chunk.source}`);
      console.log(`Content: ${chunk.content.slice(0, 200)}...`);
    }
  }

  // Step 4: Show what the injected context would look like
  console.log('\n\n=== Example Prompt Injection ===\n');
  const exampleQuery = 'payer to payer data exchange';
  const queryEmbedding = await getEmbedding(exampleQuery);
  const relevant = findRelevantChunks(queryEmbedding, allChunks, 5);

  const injectedContext = relevant.map(c => c.content).join('\n\n');

  console.log('RETRIEVED CONTEXT (would be injected into prompt):');
  console.log('='.repeat(50));
  console.log(injectedContext);
  console.log('='.repeat(50));
}

main().catch(console.error);
