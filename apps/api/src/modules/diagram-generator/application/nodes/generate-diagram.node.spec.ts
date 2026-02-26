import { describe, expect, it, vi } from 'vitest';
import { createGenerateDiagramNode } from './generate-diagram.node.js';
import type { GraphState } from '@diagram-generator/domain/graph-state.js';

const baseState: GraphState = {
    userPrompt: 'Design a VPC',
    diagramType: 'architecture',
    retrievedContext: 'VPC best practices from AWS docs',
    generatedMermaidCode: '',
    validationStatus: 'pending',
    iterationCount: 0,
    validationError: undefined,
};

describe('GenerateDiagramNode', () => {
    it('should call LLMProvider.generate and return Mermaid code', async () => {
        const mockLLM = {
            generate: vi.fn().mockResolvedValue('graph TD\n  A[VPC]-->B[Subnet]'),
            generateStream: vi.fn(),
        };

        const node = createGenerateDiagramNode(mockLLM);
        const result = await node(baseState);

        expect(result.generatedMermaidCode).toBe('graph TD\n  A[VPC]-->B[Subnet]');
        expect(mockLLM.generate).toHaveBeenCalledOnce();
    });

    it('should include validation error in prompt on retries', async () => {
        const mockLLM = {
            generate: vi.fn().mockResolvedValue('graph TD\n  A-->B'),
            generateStream: vi.fn(),
        };

        const retryState: GraphState = {
            ...baseState,
            iterationCount: 1,
            validationError: 'unexpected token at line 3',
        };

        const node = createGenerateDiagramNode(mockLLM);
        await node(retryState);

        // The prompt passed to generate() should contain the previous error
        const calledPrompt = mockLLM.generate.mock.calls[0][0];
        expect(calledPrompt).toContain('unexpected token at line 3');
    });

    it('should pass retrieved context to LLMProvider', async () => {
        const mockLLM = {
            generate: vi.fn().mockResolvedValue('graph TD\n  A-->B'),
            generateStream: vi.fn(),
        };

        const node = createGenerateDiagramNode(mockLLM);
        await node(baseState);

        const calledContext = mockLLM.generate.mock.calls[0][1];
        expect(calledContext).toBe('VPC best practices from AWS docs');
    });
});
