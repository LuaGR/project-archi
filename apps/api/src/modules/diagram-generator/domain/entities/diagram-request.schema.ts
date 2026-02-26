import { z } from 'zod';

/**
 * Input contract for diagram generation requests.
 * `diagramType` determines the LangGraph prompt strategy and the Mermaid
 * syntax the LLM is instructed to produce.
 */
export const diagramRequestSchema = z.object({
    prompt: z.string().min(1),
    diagramType: z.enum(['architecture', 'sequence', 'flowchart']),
    context: z.string().optional(),
});

export type DiagramRequest = z.infer<typeof diagramRequestSchema>;
