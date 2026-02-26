export interface DocumentChunk {
    content: string;
    source: string;
    chunkIndex: number;
}

/**
 * Splits text into chunks of approximately `maxTokens` length with overlap.
 *
 * Token estimation: 1 token ≈ 4 characters for English text.
 * This is a rough heuristic — for production you'd use a proper tokenizer,
 * but for ingestion scripts the approximation is sufficient.
 */
export function chunkDocument(
    doc: { content: string; source: string },
    maxTokens = 500,
    overlapTokens = 50,
): DocumentChunk[] {
    const maxChars = maxTokens * 4;
    const overlapChars = overlapTokens * 4;
    const chunks: DocumentChunk[] = [];
    let start = 0;
    let chunkIndex = 0;

    while (start < doc.content.length) {
        let end = start + maxChars;

        // Try to break at a paragraph or sentence boundary
        if (end < doc.content.length) {
            const paragraphBreak = doc.content.lastIndexOf('\n\n', end);
            const sentenceBreak = doc.content.lastIndexOf('. ', end);

            if (paragraphBreak > start + maxChars * 0.5) {
                end = paragraphBreak;
            } else if (sentenceBreak > start + maxChars * 0.5) {
                end = sentenceBreak + 1;
            }
        }

        chunks.push({
            content: doc.content.slice(start, end).trim(),
            source: doc.source,
            chunkIndex,
        });

        // Move forward, but overlap backwards so context isn't lost at boundaries
        start = end - overlapChars;
        chunkIndex++;
    }

    return chunks;
}
