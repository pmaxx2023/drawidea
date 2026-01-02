/**
 * Index FHIR IGs into embeddings cache
 * Run once to build the cache, then load it in the API
 */

import { GoogleGenAI } from '@google/genai';
import { writeFileSync, existsSync, readFileSync } from 'fs';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('Set GOOGLE_API_KEY environment variable');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

// Comprehensive IG sources
const IG_SOURCES = [
  // Da Vinci PDex (Payer Data Exchange)
  { url: 'https://build.fhir.org/ig/HL7/davinci-epdx/index.html', ig: 'pdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-epdx/payertopayerexchange.html', ig: 'pdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-epdx/provider-access-api.html', ig: 'pdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-epdx/member-authorizedoauth2exchange.html', ig: 'pdex' },

  // Da Vinci PAS (Prior Authorization Support)
  { url: 'https://build.fhir.org/ig/HL7/davinci-pas/index.html', ig: 'pas' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-pas/usecases.html', ig: 'pas' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-pas/background.html', ig: 'pas' },

  // Da Vinci CRD (Coverage Requirements Discovery)
  { url: 'https://build.fhir.org/ig/HL7/davinci-crd/index.html', ig: 'crd' },

  // Da Vinci DTR (Documentation Templates and Rules)
  { url: 'https://build.fhir.org/ig/HL7/davinci-dtr/index.html', ig: 'dtr' },

  // US Core
  { url: 'https://build.fhir.org/ig/HL7/US-Core/index.html', ig: 'uscore' },
  { url: 'https://build.fhir.org/ig/HL7/US-Core/general-guidance.html', ig: 'uscore' },
  { url: 'https://build.fhir.org/ig/HL7/US-Core/uscdi.html', ig: 'uscore' },

  // CARIN Blue Button
  { url: 'https://build.fhir.org/ig/HL7/carin-bb/index.html', ig: 'carin' },
  { url: 'https://build.fhir.org/ig/HL7/carin-bb/Background.html', ig: 'carin' },

  // Bulk Data
  { url: 'https://build.fhir.org/ig/HL7/bulk-data/index.html', ig: 'bulk' },
  { url: 'https://build.fhir.org/ig/HL7/bulk-data/export.html', ig: 'bulk' },

  // SMART App Launch
  { url: 'https://build.fhir.org/ig/HL7/smart-app-launch/index.html', ig: 'smart' },
  { url: 'https://build.fhir.org/ig/HL7/smart-app-launch/app-launch.html', ig: 'smart' },
  { url: 'https://build.fhir.org/ig/HL7/smart-app-launch/backend-services.html', ig: 'smart' },

  // Da Vinci PDEX Plan Net (Provider Directory)
  { url: 'https://build.fhir.org/ig/HL7/davinci-pdex-plan-net/index.html', ig: 'plannet' },

  // Da Vinci Alerts (Notifications)
  { url: 'https://build.fhir.org/ig/HL7/davinci-alerts/index.html', ig: 'alerts' },

  // Da Vinci CDex (Clinical Data Exchange)
  { url: 'https://build.fhir.org/ig/HL7/davinci-ecdx/index.html', ig: 'cdex' },

  // Subscriptions
  { url: 'https://build.fhir.org/ig/HL7/fhir-subscription-backport-ig/index.html', ig: 'subscriptions' },
];

interface Chunk {
  content: string;
  source: string;
  ig: string;
  embedding: number[];
}

interface IGCache {
  version: string;
  createdAt: string;
  chunks: Chunk[];
}

// Simple HTML to text extraction
function htmlToText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Chunk text into ~800 char segments with overlap
function chunkText(text: string, source: string, ig: string): Omit<Chunk, 'embedding'>[] {
  const chunks: Omit<Chunk, 'embedding'>[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);

  let currentChunk = '';
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > 800) {
      if (currentChunk.trim().length > 50) { // Skip tiny chunks
        chunks.push({ content: currentChunk.trim(), source, ig });
      }
      // Overlap: keep last 150 chars
      currentChunk = currentChunk.slice(-150) + ' ' + sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk.trim().length > 50) {
    chunks.push({ content: currentChunk.trim(), source, ig });
  }

  return chunks;
}

// Fetch and chunk a URL
async function fetchAndChunk(url: string, ig: string): Promise<Omit<Chunk, 'embedding'>[]> {
  try {
    console.log(`Fetching: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FHIR-IG-Indexer/1.0'
      }
    });
    if (!response.ok) {
      console.log(`  Failed: ${response.status}`);
      return [];
    }
    const html = await response.text();
    const text = htmlToText(html);
    const chunks = chunkText(text, url, ig);
    console.log(`  Got ${chunks.length} chunks (${text.length} chars)`);
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

// Rate limit helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== FHIR IG Indexer ===\n');

  const cacheFile = './scripts/rag/ig-cache.json';

  // Step 1: Fetch and chunk all sources
  console.log('Step 1: Fetching IG content...\n');
  const allChunks: Omit<Chunk, 'embedding'>[] = [];

  for (const source of IG_SOURCES) {
    const chunks = await fetchAndChunk(source.url, source.ig);
    allChunks.push(...chunks);
    await sleep(100); // Be nice to the server
  }

  console.log(`\nTotal chunks: ${allChunks.length}\n`);

  if (allChunks.length === 0) {
    console.log('No chunks fetched. Check network/URLs.');
    return;
  }

  // Step 2: Embed all chunks
  console.log('Step 2: Embedding chunks...\n');
  const embeddedChunks: Chunk[] = [];
  let embedded = 0;
  let failed = 0;

  for (const chunk of allChunks) {
    try {
      const embedding = await getEmbedding(chunk.content);
      embeddedChunks.push({ ...chunk, embedding });
      embedded++;
      if (embedded % 20 === 0) {
        console.log(`  Embedded ${embedded}/${allChunks.length}`);
      }
      await sleep(50); // Rate limit
    } catch (error) {
      failed++;
      console.log(`  Embedding failed: ${error}`);
      await sleep(1000); // Back off on error
    }
  }

  console.log(`\nEmbedded ${embedded} chunks, ${failed} failed\n`);

  // Step 3: Save cache
  const cache: IGCache = {
    version: '1.0',
    createdAt: new Date().toISOString(),
    chunks: embeddedChunks,
  };

  writeFileSync(cacheFile, JSON.stringify(cache));
  console.log(`Saved cache to ${cacheFile}`);

  // Stats by IG
  console.log('\nChunks by IG:');
  const byIG = embeddedChunks.reduce((acc, c) => {
    acc[c.ig] = (acc[c.ig] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  for (const [ig, count] of Object.entries(byIG)) {
    console.log(`  ${ig}: ${count}`);
  }
}

main().catch(console.error);
