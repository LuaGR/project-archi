/**
 * Port defining how the application retrieves secrets at runtime.
 * The infrastructure layer provides `SecretsManagerAdapter` (AWS Secrets Manager).
 * Using a port here ensures the domain never depends on `@aws-sdk/*` directly (ADR-003).
 */
export interface SecretsProvider {
    getSecret(secretName: string): Promise<string>;
}