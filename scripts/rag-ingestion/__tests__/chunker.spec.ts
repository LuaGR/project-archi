import { describe, expect, it } from 'vitest';
import { chunkDocument } from '../chunker.js';

describe('chunkDocument', () => {
    it('should return a single chunk for short documents', () => {
        const doc = { content: 'Short text', source: 'test' };
        const chunks = chunkDocument(doc, 500);
        expect(chunks).toHaveLength(1);
        expect(chunks[0].content).toBe('Short text');
        expect(chunks[0].chunkIndex).toBe(0);
    });

    it('should split long documents into multiple chunks', () => {
        // Create text longer than 500 tokens (~2000 chars)
        const longText = 'A'.repeat(3000);
        const chunks = chunkDocument({ content: longText, source: 'test' }, 500);
        expect(chunks.length).toBeGreaterThan(1);
    });

    it('should preserve source metadata across all chunks', () => {
        const longText = 'A'.repeat(3000);
        const chunks = chunkDocument({ content: longText, source: 'reliability-pillar' }, 500);
        chunks.forEach((chunk) => {
            expect(chunk.source).toBe('reliability-pillar');
        });
    });

    it('should create overlapping chunks', () => {
        const longText = 'word '.repeat(600);
        const chunks = chunkDocument({ content: longText, source: 'test' }, 500, 50);
        // With overlap, the end of chunk 1 should appear in the start of chunk 2
        if (chunks.length > 1) {
            const endOfFirst = chunks[0].content.slice(-100);
            expect(chunks[1].content).toContain(endOfFirst.trim().split(' ').slice(-5).join(' '));
        }
    });
});
