import { loadMarkdownFiles } from './loaders/markdown-loader.js';
import { chunkDocument } from './chunker.js';
import { embedChunks } from './embedder.js';
import { storeChunks } from './store.js';

async function main() {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_KEY = process.env.SUPABASE_KEY;

    if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_KEY) {
        throw new Error('Missing required environment variables');
    }

    console.log('📄 Loading documents...');
    const docs = await loadMarkdownFiles('./data/aws-well-architected');

    console.log(`📦 Chunking ${docs.length} documents...`);
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

main().catch(console.error);
