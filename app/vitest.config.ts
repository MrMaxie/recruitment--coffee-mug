import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        exclude: ['**/node_modules/**', '**/dist/**'],
        setupFiles: ['./src/spec/setup.ts'],
        alias: {
            '~': new URL('./src', import.meta.url).pathname,
        },
    },
});