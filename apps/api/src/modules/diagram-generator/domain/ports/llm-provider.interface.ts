/**
 * Port defining what the domain needs from any LLM.
 * The infrastructure layer provides `GeminiLLMAdapter` as the concrete implementation.
 * `generateStream` exists because diagram responses are long — streaming reduces perceived latency (RFC-001 §6).
 */
export interface LLMProvider {
    generate(prompt: string, context: string): Promise<string>;
    generateStream(prompt: string, context: string): AsyncIterable<string>;
}
