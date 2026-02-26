import { describe, expect, it, vi } from 'vitest';
import { createRetrieveContextNode } from './retrieve-context.node.js';
import { DocumentNotFoundError } from '@diagram-generator/domain/exceptions/index.js';
import type { GraphState } from '@diagram-generator/domain/graph-state.js';

const baseState: GraphState = {
    userPrompt: 'Design a VPC with public/private subnets',
    diagramType: 'architecture',
    retrievedContext: '',
    generatedMermaidCode: '',
    validationStatus: 'pending',
    iterationCount: 0,
    validationError: undefined,
};

describe('RetrieveContextNode', () => {
    it('should return retrieved context when relevant docs exist', async () => {
        const mockVectorStore = {
            search: vi.fn().mockResolvedValue([
                { content: 'VPC best practices', similarity: 0.9, source: 'reliability' },
                { content: 'Subnet design', similarity: 0.7, source: 'networking' },
            ]),
        };

        const node = createRetrieveContextNode(mockVectorStore);
        const result = await node(baseState);

        expect(result.retrievedContext).toContain('VPC best practices');
        expect(result.retrievedContext).toContain('Subnet design');
        expect(mockVectorStore.search).toHaveBeenCalledWith(baseState.userPrompt, 5);
    });

    it('should filter out low-similarity documents', async () => {
        const mockVectorStore = {
            search: vi.fn().mockResolvedValue([
                { content: 'Relevant doc', similarity: 0.8, source: 'good' },
                { content: 'Irrelevant doc', similarity: 0.1, source: 'noise' },
            ]),
        };

        const node = createRetrieveContextNode(mockVectorStore);
        const result = await node(baseState);

        expect(result.retrievedContext).toContain('Relevant doc');
        expect(result.retrievedContext).not.toContain('Irrelevant doc');
    });

    it('should throw DocumentNotFoundError when no relevant docs exist', async () => {
        const mockVectorStore = {
            search: vi.fn().mockResolvedValue([]),
        };

        const node = createRetrieveContextNode(mockVectorStore);

        await expect(node(baseState)).rejects.toThrow(DocumentNotFoundError);
    });

    it('should throw DocumentNotFoundError when all docs are below similarity threshold', async () => {
        const mockVectorStore = {
            search: vi.fn().mockResolvedValue([
                { content: 'Low quality', similarity: 0.1, source: 'bad' },
                { content: 'Also low', similarity: 0.2, source: 'bad2' },
            ]),
        };

        const node = createRetrieveContextNode(mockVectorStore);

        await expect(node(baseState)).rejects.toThrow(DocumentNotFoundError);
    });
});
