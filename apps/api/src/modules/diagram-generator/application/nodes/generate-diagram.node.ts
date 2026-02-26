import type { GraphState } from '@diagram-generator/domain/graph-state.js';
import type { LLMProvider } from '@diagram-generator/domain/ports/index.js';

/**
 * Builds the full prompt sent to the LLM.
 * Separating prompt construction from the node makes it testable and iterable —
 * you can tweak wording without touching the node logic.
 */
function buildPrompt(state: GraphState): string {
    const basePrompt = `You are an expert cloud architect. Generate a Mermaid.js ${state.diagramType} diagram for the following request.

User request: ${state.userPrompt}

Relevant AWS documentation:
${state.retrievedContext}

Rules:
- Output ONLY valid Mermaid.js code, no markdown fences, no explanation.
- Use the "${state.diagramType === 'architecture' ? 'graph TD' : state.diagramType}" syntax.`;

    // On retries, include the previous error so the model can self-correct
    if (state.validationError) {
        return `${basePrompt}

Your previous attempt had this syntax error: ${state.validationError}
Fix the syntax error and try again.`;
    }

    return basePrompt;
}

/**
 * LangGraph node that calls the LLM to generate Mermaid.js code.
 * On retries (iterationCount > 0), the prompt includes the previous
 * validation error so the model self-corrects instead of repeating the mistake.
 */
export function createGenerateDiagramNode(llmProvider: LLMProvider) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        const prompt = buildPrompt(state);
        const generatedMermaidCode = await llmProvider.generate(prompt, state.retrievedContext);

        return { generatedMermaidCode };
    };
}
