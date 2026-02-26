import { DomainError } from '@shared/domain/index.js';

/**
 * Thrown when the RAG search returns no relevant context for the user's query.
 * Maps to HTTP 404 — the requested knowledge was not found in the vector store.
 */
export class DocumentNotFoundError extends DomainError {
    constructor(query: string) {
        super(`No relevant documents found for query: "${query}"`, 404);
    }
}
