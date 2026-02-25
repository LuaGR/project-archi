export interface ConfigProvider {
    get(key: string): string;
}