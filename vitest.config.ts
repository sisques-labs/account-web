import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    passWithNoTests: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'app/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', '.claude'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/shared/presentation/components/ui/**',
        'src/**/index.ts',
        'src/**/*.d.ts',
        // Structural, logic-free files — enum declarations, provider wrappers
        // that only compose JSX, thin client instantiation, and the i18n
        // dictionary aggregator (a lookup table with no branching of its own).
        'src/shared/domain/enums/**',
        'src/shared/presentation/providers/**',
        'src/shared/infrastructure/http/query.client.ts',
        'src/shared/infrastructure/http/http-logger.ts',
        'src/shared/presentation/i18n/get-dictionary.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
