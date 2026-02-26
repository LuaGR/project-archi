import { DomainError } from '@shared/domain/index.js';

/**
 * Thrown when the LLM output fails Mermaid.js syntax validation.
 * Caught by the LangGraph self-correction loop, which retries with the
 * validation error fed back into the next prompt (max 3 iterations — Risk R4).
 * Propagates to the delivery layer as HTTP 400 after exhausting retries.
 */
export class InvalidMermaidSyntaxError extends DomainError {
    constructor(validationError: string) {
        super(`Generated Mermaid diagram has invalid syntax: ${validationError}`, 400);
    }
}
