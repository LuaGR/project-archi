import { readFile, readdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

export interface RawDocument {
    content: string;
    source: string;
}

/**
 * Reads all markdown files from a directory.
 * Each file becomes one RawDocument to be chunked downstream.
 */
export async function loadMarkdownFiles(dirPath: string): Promise<RawDocument[]> {
    const files = await readdir(dirPath);
    const markdownFiles = files.filter((f) => f.endsWith('.md'));

    return Promise.all(
        markdownFiles.map(async (file) => ({
            content: await readFile(join(dirPath, file), 'utf-8'),
            source: basename(file, '.md'),
        })),
    );
}
