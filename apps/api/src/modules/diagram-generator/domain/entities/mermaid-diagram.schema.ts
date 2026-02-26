import { z } from 'zod';

/**
 * Represents the result of a structural Mermaid.js syntax check.
 * Used by the LangGraph validation node to decide whether to accept or retry.
 */
export const mermaidDiagramSchema = z.object({
    code: z.string().min(1),
    type: z.enum(['graph', 'sequenceDiagram', 'flowchart', 'classDiagram', 'erDiagram']),
    isValid: z.boolean(),
});

export type MermaidDiagram = z.infer<typeof mermaidDiagramSchema>;
