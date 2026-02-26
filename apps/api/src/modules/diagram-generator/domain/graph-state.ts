import { z } from 'zod';

/**
 * The shared state object flowing through every node of the LangGraph agentic loop.
 * Each node receives this object, reads what it needs, and returns a partial update.
 *
 * `iterationCount` is capped at 3 to prevent infinite self-correction loops (Risk R4).
 * `validationError` feeds the previous failure back into the next LLM prompt so the
 * model can self-correct rather than repeating the same mistake.
 */
export const graphStateSchema = z.object({
    userPrompt: z.string(),
    diagramType: z.enum(['architecture', 'sequence', 'flowchart']),
    retrievedContext: z.string().default(''),
    generatedMermaidCode: z.string().default(''),
    validationStatus: z.enum(['pending', 'valid', 'invalid']).default('pending'),
    iterationCount: z.number().int().min(0).max(3).default(0),
    validationError: z.string().optional(),
});

export type GraphState = z.infer<typeof graphStateSchema>;
