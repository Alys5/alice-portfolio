import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./tests/setup.ts'],
      exclude: [
        ...configDefaults.exclude,
        'e2e/**',
        'node_modules',
        'dist',
        '.git',
        '.cache',
        '**/node_modules/**',
        '**/dist/**',
        '**/tests/e2e/**',
        '**/*.config.*',
        '**/coverage/**',
      ],
      root: fileURLToPath(new URL('./', import.meta.url)),
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json', 'lcov'],
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.d.ts',
          '**/*.config.*',
          '**/coverage/**',
          '**/tests/**',
          '**/cypress/**',
          '**/*.cy.*',
          '**/main.ts',
          '**/vite-env.d.ts',
        ],
        thresholds: {
          global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
        },
        all: true,
        clean: true,
        cleanOnRerun: true,
      },
    },
  }),
)
