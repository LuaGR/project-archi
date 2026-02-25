export interface SecretsProvider {
    getSecret(secretName: string): Promise<string>;
}