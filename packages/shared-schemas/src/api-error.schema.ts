import { z } from 'zod';

/**
 * Standard error response shape for all Lambda endpoints.
 * `error` holds the DomainError subclass name (e.g. `"DocumentNotFoundError"`)
 * so the frontend can map it to a user-facing message without parsing the string.
 */
export const apiErrorSchema = z.object({
    error: z.string(),
    message: z.string(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;