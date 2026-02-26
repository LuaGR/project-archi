import { describe, expect, it, vi } from 'vitest';

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
        getGenerativeModel: () => ({
            embedContent: vi.fn().mockResolvedValue({
                embedding: { values: new Array(768).fill(0.1) },
            }),
        }),
    })),
}));

import { embedChunks } from '../embedder.js';

describe('embedChunks', () => {
    it('should return embeddings with 768 dimensions', async () => {
        const chunks = [{ content: 'test', source: 'test', chunkIndex: 0 }];
        const result = await embedChunks(chunks, 'fake-key');
        expect(result[0].embedding).toHaveLength(768);
    });

    it('should preserve chunk metadata', async () => {
        const chunks = [{ content: 'test', source: 'reliability', chunkIndex: 3 }];
        const result = await embedChunks(chunks, 'fake-key');
        expect(result[0].source).toBe('reliability');
        expect(result[0].chunkIndex).toBe(3);
    });
});
