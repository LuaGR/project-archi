import { loadPdfBySections } from './loaders/pdf-loader.js';
import { loadMarkdownFiles } from './loaders/markdown-loader.js';
import { chunkDocument } from './chunker.js';
import { embedChunks } from './embedder.js';
import { storeChunks } from './store.js';
import { readdirSync } from 'node:fs';

const DATA_DIR = './data';

async function main() {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Missing required environment variables');
    }

    console.log('📄 Loading documents...');

    const files = readdirSync(DATA_DIR);
    const pdfFiles = files.filter((f) => f.endsWith('.pdf'));
    const hasMdDir = files.includes('aws-well-architected');

    // Load from PDF files and/or markdown directory
    const docs = [
        ...(await Promise.all(pdfFiles.map((f) => loadPdfBySections(`${DATA_DIR}/${f}`)))).flat(),
        ...(hasMdDir ? await loadMarkdownFiles(`${DATA_DIR}/aws-well-architected`) : []),
    ];

    if (docs.length === 0) {
        throw new Error(`No documents found in ${DATA_DIR}/. Place .pdf files or markdown files in ${DATA_DIR}/aws-well-architected/`);
    }

    console.log(`   Found ${docs.length} document sections`);

    console.log('📦 Chunking...');
    const chunks = docs.flatMap((doc) => chunkDocument(doc));
    console.log(`   Created ${chunks.length} chunks`);

    console.log('🧠 Generating embeddings...');
    const embedded = await embedChunks(chunks, GEMINI_API_KEY);

    console.log('💾 Storing in Supabase...');
    await storeChunks(
        embedded.map((e) => ({
            content: e.content,
            source: e.source,
            chunk_index: e.chunkIndex,
            embedding: e.embedding,
        })),
        SUPABASE_URL,
        SUPABASE_KEY,
    );

    console.log(`✅ Ingested ${embedded.length} chunks successfully`);
}

main().catch((err) => {
    console.error('❌ Ingestion failed:', err.message);
    process.exit(1);
});
