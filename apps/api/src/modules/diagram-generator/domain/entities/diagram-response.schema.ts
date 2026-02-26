import { z } from 'zod';

/**
 * Output contract returned by `GenerateDiagramUseCase`.
 * `iterationsUsed` is exposed so the frontend can show transparency about
 * the self-correction loop (e.g. "Generated in 2 attempts").
 */
export const diagramResponseSchema = z.object({
    mermaidCode: z.string().min(1),
    explanation: z.string(),
    diagramType: z.enum(['architecture', 'sequence', 'flowchart']),
    iterationsUsed: z.number().int().min(1).max(3),
});

export type DiagramResponse = z.infer<typeof diagramResponseSchema>;
