import { createClient } from '@supabase/supabase-js';

export interface StoredChunk {
    content: string;
    source: string;
    chunk_index: number;
    embedding: number[];
}

/**
 * Upserts embedded document chunks into the Supabase `documents` table.
 * Uses upsert (not insert) so the script is idempotent — you can re-run
 * it after updating docs without creating duplicates.
 */
export async function storeChunks(
    chunks: StoredChunk[],
    supabaseUrl: string,
    supabaseKey: string,
): Promise<void> {
    const client = createClient(supabaseUrl, supabaseKey);

    // Batch upserts to avoid hitting Supabase payload limits
    const BATCH_SIZE = 50;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);

        const { error } = await client.from('documents').upsert(
            batch.map((chunk) => ({
                content: chunk.content,
                source: chunk.source,
                chunk_index: chunk.chunk_index,
                embedding: JSON.stringify(chunk.embedding),
            })),
            { onConflict: 'source,chunk_index' },
        );

        if (error) {
            throw new Error(`Failed to upsert batch ${i}: ${error.message}`);
        }
    }
}
