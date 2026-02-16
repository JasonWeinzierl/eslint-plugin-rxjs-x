import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS ? ['verbose', 'github-actions'] : ['dot'],
    coverage: {
      reporter: process.env.GITHUB_ACTIONS ? ['text-summary', 'json-summary', 'json'] : ['text-summary'],
      reportOnFailure: true,
      exclude: [
        'scripts/**',
        'tests/etc/create-source-file-and-type-checker.ts',
        'tests/etc/from-fixture.ts',
        ...coverageConfigDefaults.exclude,
      ],
    },
    testTimeout: 10_000,
  },
});
