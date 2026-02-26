import { readFile } from 'node:fs/promises';
import { PDFParse } from 'pdf-parse';

export interface RawDocument {
    content: string;
    source: string;
}

/**
 * PDFs extract with noise: page numbers, headers/footers, broken hyphenation,
 * and excessive whitespace. This cleaner removes the most common artifacts
 * to produce text closer in quality to native markdown.
 */
function cleanPdfText(raw: string): string {
    return (
        raw
            // Remove page numbers like "Page 47 of 132" or standalone numbers on a line
            .replace(/^page\s+\d+\s+(of\s+\d+)?$/gim, '')
            .replace(/^\d+\s*$/gm, '')

            // Remove common AWS PDF headers/footers
            .replace(/^AWS Well-Architected Framework.*$/gim, '')
            .replace(/^Copyright ©.*$/gim, '')
            .replace(/^Amazon Web Services.*$/gim, '')

            // Fix hyphenation broken across lines (e.g., "avail-\nability" → "availability")
            .replace(/(\w)-\n(\w)/g, '$1$2')

            // Collapse 3+ newlines into 2 (paragraph breaks)
            .replace(/\n{3,}/g, '\n\n')

            // Remove leading/trailing whitespace per line
            .replace(/^[ \t]+|[ \t]+$/gm, '')
            .trim()
    );
}

/**
 * Loads a single PDF file and returns its cleaned text as one RawDocument.
 * pdf-parse v2 uses a class-based API: instantiate with { data }, then call getText().
 */
export async function loadPdfFile(filePath: string): Promise<RawDocument> {
    const buffer = await readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();

    return {
        content: cleanPdfText(result.text),
        source: filePath.split('/').pop()?.replace('.pdf', '') ?? 'unknown',
    };
}

/**
 * Loads a PDF and splits into per-section RawDocuments by detecting heading patterns.
 * Produces better embeddings than one giant document because each chunk stays within a single topic.
 */
export async function loadPdfBySections(filePath: string): Promise<RawDocument[]> {
    const { content, source } = await loadPdfFile(filePath);

    // Split on lines that look like section headers (e.g., "Reliability Pillar" or "DESIGN PRINCIPLES")
    const sections = content.split(/\n(?=[A-Z][A-Za-z\s]{5,}(?:\n|$))/);

    return sections
        .filter((section) => section.trim().length > 100) // Skip tiny fragments
        .map((section, index) => {
            const firstLine = section.split('\n')[0].trim();
            return {
                content: section.trim(),
                source: `${source}__${index}_${firstLine.slice(0, 50).replace(/\s+/g, '-').toLowerCase()}`,
            };
        });
}
