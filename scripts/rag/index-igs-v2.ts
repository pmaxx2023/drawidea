/**
 * FHIR IG Indexer v2
 *
 * Combines:
 * 1. RAG-fetched IG content from build.fhir.org
 * 2. Expert-curated accuracy requirements
 *
 * Creates high-accuracy embeddings for one-shot FHIR diagram generation.
 */

import { GoogleGenAI } from '@google/genai';
import { writeFileSync } from 'fs';
import { EXPERT_KNOWLEDGE, buildExpertChunk } from './expert-knowledge';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('Set GOOGLE_API_KEY environment variable');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

// IG source URLs for supplemental content - Comprehensive Edition
const IG_SOURCES = [
  // === DA VINCI IGs ===

  // PDex - Payer Data Exchange
  { url: 'https://build.fhir.org/ig/HL7/davinci-epdx/index.html', ig: 'pdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-epdx/payertopayerexchange.html', ig: 'pdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-epdx/provider-access-api.html', ig: 'pdex' },

  // PAS - Prior Authorization Support
  { url: 'https://build.fhir.org/ig/HL7/davinci-pas/index.html', ig: 'pas' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-pas/usecases.html', ig: 'pas' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-pas/specification.html', ig: 'pas' },

  // CDex - Clinical Data Exchange
  { url: 'https://build.fhir.org/ig/HL7/davinci-ecdx/index.html', ig: 'cdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-ecdx/direct-query.html', ig: 'cdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-ecdx/task-based-approach.html', ig: 'cdex' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-ecdx/attachments.html', ig: 'cdex' },

  // CRD - Coverage Requirements Discovery
  { url: 'https://build.fhir.org/ig/HL7/davinci-crd/index.html', ig: 'crd' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-crd/hooks.html', ig: 'crd' },

  // DTR - Documentation Templates and Rules
  { url: 'https://build.fhir.org/ig/HL7/davinci-dtr/index.html', ig: 'dtr' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-dtr/specification.html', ig: 'dtr' },

  // ATR - Member Attribution
  { url: 'https://build.fhir.org/ig/HL7/davinci-atr/index.html', ig: 'atr' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-atr/usecases.html', ig: 'atr' },

  // HRex - Health Record Exchange (Foundation)
  { url: 'https://build.fhir.org/ig/HL7/davinci-hrex/index.html', ig: 'hrex' },

  // DEQM - Data Exchange for Quality Measures
  { url: 'https://build.fhir.org/ig/HL7/davinci-deqm/index.html', ig: 'deqm' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-deqm/datax.html', ig: 'deqm' },

  // Alerts/Notifications
  { url: 'https://build.fhir.org/ig/HL7/davinci-alerts/index.html', ig: 'alerts' },

  // Risk Adjustment
  { url: 'https://build.fhir.org/ig/HL7/davinci-ra/index.html', ig: 'ra' },

  // PCT - Patient Cost Transparency
  { url: 'https://build.fhir.org/ig/HL7/davinci-pct/index.html', ig: 'pct' },
  { url: 'https://build.fhir.org/ig/HL7/davinci-pct/gfe_coordination.html', ig: 'pct' },

  // === CARIN IGs ===

  // CARIN Blue Button
  { url: 'https://build.fhir.org/ig/HL7/carin-bb/index.html', ig: 'carin' },
  { url: 'https://build.fhir.org/ig/HL7/carin-bb/Background.html', ig: 'carin' },
  { url: 'https://build.fhir.org/ig/HL7/carin-bb/Use_Case.html', ig: 'carin' },

  // CARIN Digital Insurance Card
  { url: 'https://build.fhir.org/ig/HL7/carin-digital-insurance-card/index.html', ig: 'carin-dic' },

  // === FOUNDATIONAL IGs ===

  // US Core
  { url: 'https://build.fhir.org/ig/HL7/US-Core/index.html', ig: 'uscore' },
  { url: 'https://build.fhir.org/ig/HL7/US-Core/general-guidance.html', ig: 'uscore' },
  { url: 'https://build.fhir.org/ig/HL7/US-Core/clinical-notes.html', ig: 'uscore' },

  // SMART App Launch
  { url: 'https://build.fhir.org/ig/HL7/smart-app-launch/index.html', ig: 'smart' },
  { url: 'https://build.fhir.org/ig/HL7/smart-app-launch/app-launch.html', ig: 'smart' },
  { url: 'https://build.fhir.org/ig/HL7/smart-app-launch/backend-services.html', ig: 'smart' },
  { url: 'https://build.fhir.org/ig/HL7/smart-app-launch/scopes-and-launch-context.html', ig: 'smart' },

  // Bulk Data
  { url: 'https://build.fhir.org/ig/HL7/bulk-data/index.html', ig: 'bulk' },
  { url: 'https://build.fhir.org/ig/HL7/bulk-data/export.html', ig: 'bulk' },

  // Subscriptions
  { url: 'https://build.fhir.org/ig/HL7/fhir-subscription-backport-ig/index.html', ig: 'subscriptions' },
  { url: 'https://build.fhir.org/ig/HL7/fhir-subscription-backport-ig/channels.html', ig: 'subscriptions' },
  { url: 'https://build.fhir.org/ig/HL7/fhir-subscription-backport-ig/payloads.html', ig: 'subscriptions' },

  // === PHARMACY IGs ===

  // Drug Formulary
  { url: 'https://build.fhir.org/ig/HL7/davinci-drug-formulary/index.html', ig: 'formulary' },

  // Plan-Net Provider Directory
  { url: 'https://build.fhir.org/ig/HL7/davinci-pdex-plan-net/index.html', ig: 'plannet' },

  // Specialty Rx
  { url: 'https://build.fhir.org/ig/HL7/fhir-specialty-rx/index.html', ig: 'specialty-rx' },

  // === QUALITY IGs ===

  // QI-Core
  { url: 'https://build.fhir.org/ig/HL7/fhir-qi-core/index.html', ig: 'qicore' },

  // Quality Measure IG
  { url: 'https://build.fhir.org/ig/HL7/cqf-measures/index.html', ig: 'cqfm' },

  // === CLINICAL EXCHANGE IGs ===

  // C-CDA on FHIR
  { url: 'https://build.fhir.org/ig/HL7/ccda-on-fhir/index.html', ig: 'c-cda' },

  // International Patient Summary
  { url: 'https://build.fhir.org/ig/HL7/fhir-ips/index.html', ig: 'ips' },

  // === REFERRAL IGs ===

  // BSeR - Bidirectional Services eReferral
  { url: 'https://build.fhir.org/ig/HL7/bser/index.html', ig: 'bser' },

  // eLTSS
  { url: 'https://build.fhir.org/ig/HL7/eLTSS/index.html', ig: 'eltss' },

  // === PUBLIC HEALTH IGs ===

  // eCR - Electronic Case Reporting
  { url: 'https://build.fhir.org/ig/HL7/case-reporting/index.html', ig: 'ecr' },

  // MedMorph
  { url: 'https://build.fhir.org/ig/HL7/fhir-medmorph/index.html', ig: 'medmorph' },
];

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

// HTML to text
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

// Chunk text - larger chunks for better context
function chunkText(text: string, source: string, ig: string): Omit<Chunk, 'embedding'>[] {
  const chunks: Omit<Chunk, 'embedding'>[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);

  let currentChunk = '';
  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > 1200) {
      if (currentChunk.trim().length > 100) {
        chunks.push({ content: currentChunk.trim(), source, ig, type: 'rag' });
      }
      currentChunk = currentChunk.slice(-200) + ' ' + sentence;
    } else {
      currentChunk += ' ' + sentence;
    }
  }

  if (currentChunk.trim().length > 100) {
    chunks.push({ content: currentChunk.trim(), source, ig, type: 'rag' });
  }

  return chunks;
}

async function fetchAndChunk(url: string, ig: string): Promise<Omit<Chunk, 'embedding'>[]> {
  try {
    console.log(`  Fetching: ${url}`);
    const response = await fetch(url, {
      headers: { 'User-Agent': 'FHIR-IG-Indexer/2.0' }
    });
    if (!response.ok) {
      console.log(`    Failed: ${response.status}`);
      return [];
    }
    const html = await response.text();
    const text = htmlToText(html);
    const chunks = chunkText(text, url, ig);
    console.log(`    Got ${chunks.length} chunks`);
    return chunks;
  } catch (error) {
    console.log(`    Error: ${error}`);
    return [];
  }
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: [{ parts: [{ text }] }],
  });
  return response.embeddings?.[0]?.values || [];
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('=== FHIR IG Indexer v2 ===\n');
  console.log('Combining expert knowledge + RAG content\n');

  const allChunks: Omit<Chunk, 'embedding'>[] = [];

  // Step 1: Add expert knowledge chunks (HIGH PRIORITY)
  console.log('Step 1: Adding expert knowledge chunks...\n');
  for (const knowledge of EXPERT_KNOWLEDGE) {
    const expertContent = buildExpertChunk(knowledge);
    allChunks.push({
      content: expertContent,
      source: `expert:${knowledge.ig}`,
      ig: knowledge.ig,
      type: 'expert',
    });
    console.log(`  Added expert chunk for: ${knowledge.name}`);
  }
  console.log(`\nTotal expert chunks: ${allChunks.filter(c => c.type === 'expert').length}\n`);

  // Step 2: Fetch supplemental RAG content
  console.log('Step 2: Fetching supplemental IG content...\n');
  for (const source of IG_SOURCES) {
    const chunks = await fetchAndChunk(source.url, source.ig);
    allChunks.push(...chunks);
    await sleep(100);
  }

  console.log(`\nTotal chunks: ${allChunks.length}`);
  console.log(`  Expert: ${allChunks.filter(c => c.type === 'expert').length}`);
  console.log(`  RAG: ${allChunks.filter(c => c.type === 'rag').length}\n`);

  // Step 3: Embed all chunks
  console.log('Step 3: Embedding chunks...\n');
  const embeddedChunks: Chunk[] = [];
  let embedded = 0;

  for (const chunk of allChunks) {
    try {
      const embedding = await getEmbedding(chunk.content);
      embeddedChunks.push({ ...chunk, embedding });
      embedded++;
      if (embedded % 20 === 0) {
        console.log(`  Embedded ${embedded}/${allChunks.length}`);
      }
      await sleep(50);
    } catch (error) {
      console.log(`  Embedding failed: ${error}`);
      await sleep(1000);
    }
  }

  console.log(`\nEmbedded ${embedded} chunks\n`);

  // Step 4: Save cache
  const cache: IGCache = {
    version: '2.0',
    createdAt: new Date().toISOString(),
    chunks: embeddedChunks,
  };

  const cacheFile = './scripts/rag/ig-cache.json';
  writeFileSync(cacheFile, JSON.stringify(cache));
  console.log(`Saved cache to ${cacheFile}`);

  // Stats
  console.log('\nChunks by IG:');
  const byIG: Record<string, { expert: number; rag: number }> = {};
  for (const chunk of embeddedChunks) {
    if (!byIG[chunk.ig]) byIG[chunk.ig] = { expert: 0, rag: 0 };
    byIG[chunk.ig][chunk.type]++;
  }
  for (const [ig, counts] of Object.entries(byIG)) {
    console.log(`  ${ig}: ${counts.expert} expert + ${counts.rag} RAG = ${counts.expert + counts.rag} total`);
  }

  // File size
  const stats = require('fs').statSync(cacheFile);
  console.log(`\nCache file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
