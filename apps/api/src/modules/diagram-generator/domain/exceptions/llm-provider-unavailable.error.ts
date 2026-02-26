import { DomainError } from '@shared/domain/index.js';

/**
 * Thrown when the upstream LLM API call fails.
 * Maps to HTTP 502 (Bad Gateway) rather than 500 — the failure is in a
 * downstream dependency, not in this service's own logic.
 */
export class LLMProviderUnavailableError extends DomainError {
    constructor(cause?: string) {
        super(`LLM provider is unavailable${cause ? `: ${cause}` : ''}`, 502);
    }
}
