import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
    coverage: {
      reporter: process.env.GITHUB_ACTIONS ? ['text-summary', 'json-summary', 'json'] : ['text-summary'],
      reportOnFailure: true,
      exclude: ['scripts/**', ...coverageConfigDefaults.exclude],
    },
    testTimeout: 10_000,
  },
});
