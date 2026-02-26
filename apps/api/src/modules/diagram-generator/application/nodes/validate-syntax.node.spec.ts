import { describe, expect, it, vi } from 'vitest';
import { createValidateSyntaxNode } from './validate-syntax.node.js';
import { InvalidMermaidSyntaxError } from '@diagram-generator/domain/exceptions/index.js';
import type { GraphState } from '@diagram-generator/domain/graph-state.js';

const baseState: GraphState = {
    userPrompt: 'Design a VPC',
    diagramType: 'architecture',
    retrievedContext: 'some context',
    generatedMermaidCode: 'graph TD\n  A-->B',
    validationStatus: 'pending',
    iterationCount: 0,
    validationError: undefined,
};

describe('ValidateSyntaxNode', () => {
    it('should return valid status when Mermaid syntax is correct', async () => {
        const mockValidator = { validate: vi.fn().mockResolvedValue(true) };

        const node = createValidateSyntaxNode(mockValidator);
        const result = await node(baseState);

        expect(result.validationStatus).toBe('valid');
    });

    it('should return invalid status and increment iterationCount on failure', async () => {
        const mockValidator = { validate: vi.fn().mockResolvedValue(false) };

        const node = createValidateSyntaxNode(mockValidator);
        const result = await node(baseState);

        expect(result.validationStatus).toBe('invalid');
        expect(result.iterationCount).toBe(1);
        expect(result.validationError).toBeDefined();
    });

    it('should throw InvalidMermaidSyntaxError after MAX_ITERATIONS', async () => {
        const mockValidator = { validate: vi.fn().mockResolvedValue(false) };
        const exhaustedState: GraphState = { ...baseState, iterationCount: 2 };

        const node = createValidateSyntaxNode(mockValidator);

        await expect(node(exhaustedState)).rejects.toThrow(InvalidMermaidSyntaxError);
    });

    it('should not throw on iteration 2 (still has one more try)', async () => {
        const mockValidator = { validate: vi.fn().mockResolvedValue(false) };
        const state: GraphState = { ...baseState, iterationCount: 1 };

        const node = createValidateSyntaxNode(mockValidator);
        const result = await node(state);

        expect(result.iterationCount).toBe(2);
        expect(result.validationStatus).toBe('invalid');
    });
});
