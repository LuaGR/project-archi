import { GoogleGenerativeAI } from '@google/generative-ai';

export interface EmbeddedChunk {
    content: string;
    source: string;
    chunkIndex: number;
    embedding: number[];
}

/**
 * Converts text chunks into vector embeddings using Gemini's embedding model.
 *
 * Uses 'text-embedding-004' which produces 768-dimensional vectors.
 * Each dimension captures a different aspect of the text's meaning —
 * topic, sentiment, specificity, etc. You don't choose what each
 * dimension means; the model learned these representations during training.
 */
export async function embedChunks(
    chunks: { content: string; source: string; chunkIndex: number }[],
    apiKey: string,
): Promise<EmbeddedChunk[]> {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const results: EmbeddedChunk[] = [];

    // Process in batches to respect rate limits (Risk R1)
    const BATCH_SIZE = 20;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);

        const embeddings = await Promise.all(
            batch.map(async (chunk) => {
                const result = await model.embedContent(chunk.content);
                return {
                    ...chunk,
                    embedding: result.embedding.values,
                };
            }),
        );

        results.push(...embeddings);

        // Rate limiting — wait between batches to avoid 429s
        if (i + BATCH_SIZE < chunks.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    return results;
}
