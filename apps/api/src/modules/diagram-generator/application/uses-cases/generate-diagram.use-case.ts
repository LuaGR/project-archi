import type { LLMProvider, VectorStore, MermaidValidator } from '@diagram-generator/domain/ports/index.js';
import type { DiagramRequest, DiagramResponse } from '@diagram-generator/domain/entities/index.js';
import { buildDiagramGraph } from '../graph.js';

/**
 * Orchestrates the full diagram generation flow.
 * Creates the LangGraph, invokes it with the user's request,
 * and maps the final GraphState to a DiagramResponse.
 *
 * All ports are injected via constructor — the Use Case never
 * knows about Gemini, Supabase, or mermaid.js directly.
 */
export class GenerateDiagramUseCase {
    constructor(
        private readonly llmProvider: LLMProvider,
        private readonly vectorStore: VectorStore,
        private readonly mermaidValidator: MermaidValidator,
    ) { }

    async execute(request: DiagramRequest): Promise<DiagramResponse> {
        const graph = buildDiagramGraph(
            this.llmProvider,
            this.vectorStore,
            this.mermaidValidator,
        );

        const finalState = await graph.invoke({
            userPrompt: request.prompt,
            diagramType: request.diagramType,
        });

        return {
            mermaidCode: finalState.generatedMermaidCode,
            explanation: `Generated ${request.diagramType} diagram`,
            diagramType: request.diagramType,
            iterationsUsed: finalState.iterationCount + 1,
        };
    }

    /**
     * Streaming variant — yields partial tokens as the LLM produces them.
     * The delivery layer pipes this into an SSE response
     * so the frontend sees tokens appearing in real time.
     */
    async *executeStream(request: DiagramRequest): AsyncIterable<string> {
        const graph = buildDiagramGraph(
            this.llmProvider,
            this.vectorStore,
            this.mermaidValidator,
        );

        // Simplified: full streaming requires LangGraph's streaming API
        const finalState = await graph.invoke({
            userPrompt: request.prompt,
            diagramType: request.diagramType,
        });

        yield finalState.generatedMermaidCode;
    }
}