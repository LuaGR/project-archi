/**
 * Port defining how the application reads non-secret runtime configuration.
 * Separated from `SecretsProvider` because config is synchronous (already in `process.env`)
 * while secrets are async (fetched from AWS at cold start).
 */
export interface ConfigProvider {
    get(key: string): string;
}