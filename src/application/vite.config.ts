/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    target: 'node24',
    ssr: true,
    outDir: 'dist',
    rollupOptions: {
      input: resolve(import.meta.dirname, 'src/index.ts'),
      external: [/^node:/, '@belairs-buvette/domain', '@belairs-buvette/infrastructure'],
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: 'index.js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
