/**
 * FHIR IG RAG v2 - Retrieval Augmented Generation for FHIR workflows
 *
 * Loads pre-computed embeddings (expert knowledge + RAG content)
 * and retrieves relevant IG content for injection into prompts.
 *
 * Expert chunks are prioritized over RAG chunks for accuracy.
 */

import { GoogleGenAI } from '@google/genai';
import igCache from '../../scripts/rag/ig-cache.json';
import { QUIBBLES } from '../../scripts/rag/expert-knowledge';

interface Chunk {
  content: string;
  source: string;
  ig: string;
  type: 'expert' | 'rag';
  embedding: number[];
}

interface IGCache {
  version: string;
  createdAt: string;
  chunks: Chunk[];
}

// Load cache at module init
const cache = igCache as IGCache;
const expertCount = cache.chunks.filter((c: any) => c.type === 'expert').length;
const ragCount = cache.chunks.filter((c: any) => c.type === 'rag').length;
console.log(`[FHIR-RAG] Loaded ${cache.chunks.length} chunks (${expertCount} expert, ${ragCount} RAG) v${cache.version}`);

// Cosine similarity between two vectors
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

// Get embedding for query text
async function getQueryEmbedding(text: string, apiKey: string): Promise<number[]> {
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ parts: [{ text }] }],
  });
  return response.embeddings?.[0]?.values || [];
}

// Find relevant chunks with expert prioritization
function findRelevantChunks(queryEmbedding: number[], k: number = 5): Array<Chunk & { score: number }> {
  const scored = cache.chunks
    .map((chunk: any) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score);

  // Prioritize: Get top expert chunks first, then fill with RAG
  const expertChunks = scored.filter(c => c.type === 'expert').slice(0, 2);
  const ragChunks = scored.filter(c => c.type === 'rag').slice(0, k - expertChunks.length);

  // Combine and re-sort by score
  const combined = [...expertChunks, ...ragChunks].sort((a, b) => b.score - a.score);

  return combined.slice(0, k);
}

/**
 * Retrieve relevant FHIR IG context for a given concept
 *
 * @param concept - The user's input concept/prompt
 * @param apiKey - Google API key for embeddings
 * @param topK - Number of chunks to retrieve (default 5)
 * @returns Object with retrieved context and metadata
 */
export async function retrieveFHIRContext(
  concept: string,
  apiKey: string,
  topK: number = 5
): Promise<{
  context: string;
  sources: string[];
  igs: string[];
}> {
  try {
    // Get embedding for the concept
    const queryEmbedding = await getQueryEmbedding(concept, apiKey);

    // Find relevant chunks
    const relevant = findRelevantChunks(queryEmbedding, topK);

    // Build context string
    const context = relevant
      .map(chunk => chunk.content)
      .join('\n\n');

    // Get unique sources and IGs
    const sources = [...new Set(relevant.map(c => c.source))];
    const igs = [...new Set(relevant.map(c => c.ig))];

    const expertUsed = relevant.filter(c => c.type === 'expert').length;
    const ragUsed = relevant.filter(c => c.type === 'rag').length;
    console.log(`[FHIR-RAG] Retrieved ${relevant.length} chunks (${expertUsed} expert, ${ragUsed} RAG) from IGs: ${igs.join(', ')}`);
    console.log(`[FHIR-RAG] Top scores: ${relevant.slice(0, 3).map(c => `${c.score.toFixed(3)}[${c.type}]`).join(', ')}`);

    return { context, sources, igs };
  } catch (error) {
    console.error('[FHIR-RAG] Retrieval failed:', error);
    return { context: '', sources: [], igs: [] };
  }
}

// QUIBBLES imported from expert-knowledge.ts

function buildQuibblesSection(igs: string[]): string {
  const relevantQuibbles: string[] = [];
  for (const ig of igs) {
    const q = QUIBBLES[ig];
    if (q) relevantQuibbles.push(...q.slice(0, 2)); // Top 2 per IG
  }
  if (relevantQuibbles.length === 0) return '';

  return `

🧐 THE QUIBBLER - Expert-level details FHIR specialists will notice:
${relevantQuibbles.map(q => `• ${q}`).join('\n')}

Incorporate these if they fit naturally. They demonstrate deep domain expertise.
`;
}

/**
 * Build a prompt injection with retrieved FHIR context
 */
export function buildRAGPromptInjection(context: string, igs: string[]): string {
  if (!context) return '';

  const quibbles = buildQuibblesSection(igs);

  return `

FHIR IMPLEMENTATION GUIDE CONTEXT (from official HL7 specifications):
The following is authoritative content from the relevant FHIR Implementation Guides (${igs.join(', ').toUpperCase()}).
Use this information to ensure accuracy in your diagram:

---
${context}
---

IMPORTANT: Base your diagram on the workflow, resources, and operations described above. This is the source of truth for FHIR accuracy.
${quibbles}
`;
}
