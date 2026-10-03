import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import { createBootScript } from './src/lib/bootScript.ts';

function bootScript(): Plugin {
    return {
        name: 'graph-labs-boot-script',
        transformIndexHtml: () => [
            { tag: 'script', children: createBootScript(), injectTo: 'head-prepend' },
        ],
    };
}

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [react(), tailwindcss(), bootScript()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
    build: isSsrBuild
        ? { outDir: 'dist-ssr', emptyOutDir: true }
        : {
              manifest: true,
              rolldownOptions: {
                  output: {
                      codeSplitting: {
                          groups: [
                              {
                                  name: 'vendor',
                                  test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
                              },
                          ],
                      },
                  },
              },
          },
}));
