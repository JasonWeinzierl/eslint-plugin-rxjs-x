import type { ESLint, Linter } from 'eslint';

export const createRecommendedConfig = (
  plugin: ESLint.Plugin,
) => ({
  ...baseConfig,
  name: 'rxjs-x/recommended' as const,
  plugins: {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- "A type annotation is necessary."
    'rxjs-x': plugin as ESLint.Plugin,
  },
} satisfies Linter.Config);

export const createLegacyRecommendedConfig = () => ({
  ...baseConfig,
  plugins: ['rxjs-x'] as const,
} satisfies Linter.LegacyConfig);

const baseConfig = {
  rules: {
    'rxjs-x/no-async-subscribe': 'error',
    'rxjs-x/no-create': 'error',
    'rxjs-x/no-ignored-notifier': 'error',
    'rxjs-x/no-ignored-replay-buffer': 'error',
    'rxjs-x/no-ignored-takewhile-value': 'error',
    'rxjs-x/no-implicit-any-catch': 'error',
    'rxjs-x/no-index': 'error',
    'rxjs-x/no-internal': 'error',
    'rxjs-x/no-nested-subscribe': 'error',
    'rxjs-x/no-redundant-notify': 'error',
    'rxjs-x/no-sharereplay': 'error',
    'rxjs-x/no-subject-unsubscribe': 'error',
    'rxjs-x/no-subscribe-in-pipe': 'error',
    'rxjs-x/no-topromise': 'error',
    'rxjs-x/no-unbound-methods': 'error',
    'rxjs-x/no-unsafe-subject-next': 'error',
    'rxjs-x/no-unsafe-takeuntil': 'error',
    'rxjs-x/prefer-observer': 'error',
    'rxjs-x/prefer-root-operators': 'error',
    'rxjs-x/throw-error': 'error',
  } satisfies Linter.RulesRecord,
};
