import { z } from 'zod';

/**
 * Duplicates of the `diagram-request` and `diagram-response` schemas from `apps/api`.
 * Intentionally duplicated here because `packages/shared-schemas` cannot import from
 * `apps/api` — that would invert the dependency direction (package → app).
 * These define the HTTP API contract; `apps/api` schemas may have additional internal fields.
 */
export const diagramRequestSchema = z.object({
    prompt: z.string().min(1),
    diagramType: z.enum(['architecture', 'sequence', 'flowchart']),
    context: z.string().optional(),
});

export const diagramResponseSchema = z.object({
    mermaidCode: z.string().min(1),
    explanation: z.string(),
    diagramType: z.enum(['architecture', 'sequence', 'flowchart']),
    iterationsUsed: z.number().int().min(1).max(3),
});

export type DiagramRequest = z.infer<typeof diagramRequestSchema>;
export type DiagramResponse = z.infer<typeof diagramResponseSchema>;
