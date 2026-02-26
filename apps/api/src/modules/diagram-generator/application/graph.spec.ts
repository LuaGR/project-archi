import { describe, expect, it, vi } from 'vitest';
import { buildDiagramGraph } from './graph.js';

describe('Diagram Generation Graph', () => {
    it('should complete in 1 iteration when syntax is valid', async () => {
        const graph = buildDiagramGraph(
            {
                generate: vi.fn().mockResolvedValue('graph TD\n  A-->B'),
                generateStream: vi.fn(),
            },
            {
                search: vi.fn().mockResolvedValue([
                    { content: 'docs', similarity: 0.9, source: 'test' },
                ]),
            },
            { validate: vi.fn().mockResolvedValue(true) },
        );

        const result = await graph.invoke({
            userPrompt: 'test',
            diagramType: 'architecture',
        });

        expect(result.validationStatus).toBe('valid');
        expect(result.iterationCount).toBe(0);
    });

    it('should self-correct and succeed on second attempt', async () => {
        const mockValidator = { validate: vi.fn() };
        // First call: invalid. Second call: valid.
        mockValidator.validate
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);

        const graph = buildDiagramGraph(
            {
                generate: vi.fn().mockResolvedValue('graph TD\n  A-->B'),
                generateStream: vi.fn(),
            },
            {
                search: vi.fn().mockResolvedValue([
                    { content: 'docs', similarity: 0.9, source: 'test' },
                ]),
            },
            mockValidator,
        );

        const result = await graph.invoke({
            userPrompt: 'test',
            diagramType: 'architecture',
        });

        expect(result.validationStatus).toBe('valid');
        expect(result.iterationCount).toBe(1);
    });
});
