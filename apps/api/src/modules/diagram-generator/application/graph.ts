import { StateGraph, END } from '@langchain/langgraph';
import type { LLMProvider, VectorStore, MermaidValidator } from '@diagram-generator/domain/ports/index.js';
import type { GraphState } from '@diagram-generator/domain/graph-state.js';
import { GraphStateSchema } from '@diagram-generator/domain/graph-state.js';
import { createRetrieveContextNode, createGenerateDiagramNode, createValidateSyntaxNode } from './nodes/index.js';

/**
 * Determines the next node after validation.
 * This is the "brain" of the agentic loop — it decides whether to
 * accept the result or loop back for another attempt.
 */
function routeAfterValidation(state: GraphState): 'generate' | typeof END {
    if (state.validationStatus === 'valid') {
        return END;
    }
    // Loop back to generate with the error feedback
    return 'generate';
}

/**
 * Builds the LangGraph StateGraph for diagram generation.
 *
 * The graph looks like:
 *
 *   START → retrieve → generate → validate ──► END (if valid)
 *                          ▲         │
 *                          └─────────┘ (if invalid, retry)
 *
 * All 3 ports are injected — the graph is fully testable with mocks.
 */
export function buildDiagramGraph(
    llmProvider: LLMProvider,
    vectorStore: VectorStore,
    mermaidValidator: MermaidValidator,
) {
    return new StateGraph(GraphStateSchema)
        .addNode('retrieve', createRetrieveContextNode(vectorStore))
        .addNode('generate', createGenerateDiagramNode(llmProvider))
        .addNode('validate', createValidateSyntaxNode(mermaidValidator))
        .addEdge('__start__', 'retrieve')
        .addEdge('retrieve', 'generate')
        .addEdge('generate', 'validate')
        .addConditionalEdges('validate', routeAfterValidation)
        .compile();
}
