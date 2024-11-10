import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@cmmv/core': path.resolve(__dirname, 'packages/core'),
            /*'@cmmv/auth': path.resolve(__dirname, 'packages/core/auth'),
            '@cmmv/cache': path.resolve(__dirname, 'packages/core/cache'),            
            '@cmmv/http': path.resolve(__dirname, 'packages/http'),
            'supertest': path.resolve(__dirname, 'node_modules/supertest'),
            'after': path.resolve(__dirname, 'node_modules/after'),
            'typeis': path.resolve(__dirname, 'node_modules/typeis')*/
        },
    },
    test: {
        globals: true,
        testTimeout: 10000,
        environment: 'node',
    },
});
