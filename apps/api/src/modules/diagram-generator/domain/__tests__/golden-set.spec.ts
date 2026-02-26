import { describe, it } from 'vitest';

/**
 * Golden Set tests validate end-to-end quality with REAL API calls.
 * They are expensive and slow — run only in CI, never in local dev.
 *
 * Each test uses a known prompt, runs it through the full pipeline
 * with real Gemini + real Supabase, and asserts the output is valid Mermaid.
 *
 * Skipped by default — enable in CI with GOLDEN_SET=true env var.
 */
describe.skipIf(!process.env.GOLDEN_SET)('Golden Set', () => {
    it.todo('should generate a valid architecture diagram for a VPC request');
    it.todo('should generate a valid sequence diagram for an API flow');
    it.todo('should generate a valid flowchart for a CI/CD pipeline');
});
