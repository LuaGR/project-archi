import type { GraphState } from '@diagram-generator/domain/graph-state.js';
import type { MermaidValidator } from '@diagram-generator/domain/ports/index.js';
import { InvalidMermaidSyntaxError } from '@diagram-generator/domain/exceptions/index.js';

const MAX_ITERATIONS = 3;

/**
 * LangGraph node that validates the generated Mermaid.js code.
 * Returns updated validationStatus and, on failure, increments iterationCount.
 * When MAX_ITERATIONS is reached, throws InvalidMermaidSyntaxError to exit the loop.
 */
export function createValidateSyntaxNode(mermaidValidator: MermaidValidator) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        const isValid = await mermaidValidator.validate(state.generatedMermaidCode);

        if (isValid) {
            return { validationStatus: 'valid' as const };
        }

        const nextIteration = state.iterationCount + 1;

        if (nextIteration >= MAX_ITERATIONS) {
            throw new InvalidMermaidSyntaxError(
                `Failed after ${MAX_ITERATIONS} attempts. Last error: ${state.validationError ?? 'unknown'}`,
            );
        }

        return {
            validationStatus: 'invalid' as const,
            iterationCount: nextIteration,
            validationError: `Invalid Mermaid syntax in attempt ${nextIteration}`,
        };
    };
}
