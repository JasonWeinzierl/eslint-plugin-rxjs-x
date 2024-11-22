import { TSESLint } from '@typescript-eslint/utils';

export const createStrictConfig = (
  plugin: TSESLint.FlatConfig.Plugin,
) => ({
  plugins: {
    'rxjs-x': plugin,
  },
  rules: {
    'rxjs-x/no-async-subscribe': 'error',
    'rxjs-x/no-create': 'error',
    'rxjs-x/no-explicit-generics': 'error',
    'rxjs-x/no-exposed-subjects': 'error',
    'rxjs-x/no-ignored-default-value': 'error',
    'rxjs-x/no-ignored-error': 'error',
    'rxjs-x/no-ignored-notifier': 'error',
    'rxjs-x/no-ignored-observable': 'error',
    'rxjs-x/no-ignored-replay-buffer': 'error',
    'rxjs-x/no-ignored-takewhile-value': 'error',
    'rxjs-x/no-implicit-any-catch': ['error', {
      allowExplicitAny: false as const,
    }],
    'rxjs-x/no-index': 'error',
    'rxjs-x/no-internal': 'error',
    'rxjs-x/no-nested-subscribe': 'error',
    'rxjs-x/no-redundant-notify': 'error',
    'rxjs-x/no-sharereplay': 'error',
    'rxjs-x/no-subclass': 'error',
    'rxjs-x/no-subject-unsubscribe': 'error',
    'rxjs-x/no-topromise': 'error',
    'rxjs-x/no-unbound-methods': 'error',
    'rxjs-x/no-unsafe-subject-next': 'error',
    'rxjs-x/no-unsafe-takeuntil': 'error',
    'rxjs-x/prefer-observer': 'error',
    'rxjs-x/prefer-root-operators': 'error',
    'rxjs-x/throw-error': ['error', {
      allowThrowingAny: false as const,
      allowThrowingUnknown: false as const,
    }],
  },
} satisfies TSESLint.FlatConfig.Config);
