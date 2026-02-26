import { describe, expect, it, vi } from 'vitest';
import { GenerateDiagramUseCase } from './generate-diagram.use-case.js';
import { DocumentNotFoundError, LLMProviderUnavailableError } from '@diagram-generator/domain/exceptions/index.js';

function createMocks() {
    return {
        vectorStore: { search: vi.fn() },
        llmProvider: { generate: vi.fn(), generateStream: vi.fn() },
        validator: { validate: vi.fn() },
    };
}

describe('GenerateDiagramUseCase', () => {
    it('should return valid Mermaid code on first attempt', async () => {
        const { vectorStore, llmProvider, validator } = createMocks();

        vectorStore.search.mockResolvedValue([
            { content: 'VPC best practices', similarity: 0.9, source: 'reliability' },
        ]);
        llmProvider.generate.mockResolvedValue('graph TD\n  A[VPC]-->B[Subnet]');
        validator.validate.mockResolvedValue(true);

        const useCase = new GenerateDiagramUseCase(llmProvider, vectorStore, validator);
        const result = await useCase.execute({
            prompt: 'Design a VPC',
            diagramType: 'architecture',
        });

        expect(result.mermaidCode).toContain('graph TD');
        expect(result.diagramType).toBe('architecture');
        expect(result.iterationsUsed).toBeGreaterThanOrEqual(1);
    });

    it('should throw DocumentNotFoundError when no context is found', async () => {
        const { vectorStore, llmProvider, validator } = createMocks();

        vectorStore.search.mockResolvedValue([]);

        const useCase = new GenerateDiagramUseCase(llmProvider, vectorStore, validator);

        await expect(
            useCase.execute({ prompt: 'pizza recipes', diagramType: 'architecture' }),
        ).rejects.toThrow(DocumentNotFoundError);
    });

    it('should throw LLMProviderUnavailableError when LLM fails', async () => {
        const { vectorStore, llmProvider, validator } = createMocks();

        vectorStore.search.mockResolvedValue([
            { content: 'some docs', similarity: 0.9, source: 'test' },
        ]);
        llmProvider.generate.mockRejectedValue(
            new LLMProviderUnavailableError('rate limit'),
        );

        const useCase = new GenerateDiagramUseCase(llmProvider, vectorStore, validator);

        await expect(
            useCase.execute({ prompt: 'Design a VPC', diagramType: 'architecture' }),
        ).rejects.toThrow(LLMProviderUnavailableError);
    });
});
