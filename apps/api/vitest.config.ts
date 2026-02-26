import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'url';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        passWithNoTests: true,
        include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/**/index.ts'],
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@shared': fileURLToPath(new URL('./src/modules/shared', import.meta.url)),
        },
    },
});
