/**
 * A chunk of text retrieved from the knowledge base.
 * `similarity` is retained in the domain to allow Use Cases to filter
 * low-confidence results before passing context to the LLM.
 */
export interface Document {
    content: string;
    similarity: number;
    source: string;
}

/**
 * Port defining what the domain needs from any vector database.
 * The infrastructure layer provides `SupabaseVectorAdapter` as the concrete implementation.
 */
export interface VectorStore {
    search(query: string, topK: number): Promise<Document[]>;
}
