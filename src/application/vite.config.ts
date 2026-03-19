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
      external: [/^node:/, '@CHANGE_ME/domain', '@CHANGE_ME/infrastructure'],
      output: {
        file: 'dist/index.js',
        format: 'cjs',
        entryFileNames: 'index.js',
      },
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
})
