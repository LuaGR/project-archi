import type { GraphState } from '@diagram-generator/domain/graph-state.js';
import type { VectorStore } from '@diagram-generator/domain/ports/index.js';
import { DocumentNotFoundError } from '@diagram-generator/domain/exceptions/index.js';

const TOP_K = 5;
const MIN_SIMILARITY = 0.3;

/**
 * LangGraph node that retrieves relevant AWS docs from the vector store.
 *
 * TOP_K = 5: retrieve the 5 most similar chunks.
 * MIN_SIMILARITY = 0.3: discard chunks below this threshold —
 * a low-similarity chunk would add noise to the LLM prompt and degrade output quality.
 */
export function createRetrieveContextNode(vectorStore: VectorStore) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        const docs = await vectorStore.search(state.userPrompt, TOP_K);

        const relevant = docs.filter((doc) => doc.similarity >= MIN_SIMILARITY);

        if (relevant.length === 0) {
            throw new DocumentNotFoundError(state.userPrompt);
        }

        const retrievedContext = relevant.map((doc) => doc.content).join('\n\n---\n\n');

        return { retrievedContext };
    };
}
