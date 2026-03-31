// @ts-check
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import gitignore from 'eslint-config-flat-gitignore';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import importX from 'eslint-plugin-import-x';
import n from 'eslint-plugin-n';
import packageJson from 'eslint-plugin-package-json';
import perfectionist from 'eslint-plugin-perfectionist';
import regexp from 'eslint-plugin-regexp';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(gitignore(), {
  files: [
    '**/*.js',
    '**/*.ts',
  ],
  plugins: {
    perfectionist,
    'import-x': importX,
  },
  extends: [
    js.configs.recommended,
    stylistic.configs['disable-legacy'],
    stylistic.configs.customize({
      quotes: 'single',
      indent: 2,
      semi: true,
      jsx: false,
      braceStyle: '1tbs',
      commaDangle: 'always-multiline',
    }),
    n.configs['flat/recommended-module'],
    regexp.configs.recommended,
    unicorn.configs.unopinionated,
  ],
  rules: {
    '@stylistic/arrow-parens': 'off',
    '@stylistic/multiline-ternary': 'off',

    'perfectionist/sort-imports': [
      'warn',
      {
        newlinesBetween: 0,
      },
    ],
    'perfectionist/sort-named-imports': 'warn',

    'import-x/no-cycle': 'error',
    'import-x/no-duplicates': 'warn',
    'import-x/no-self-import': 'error',
    'import-x/no-useless-path-segments': 'warn',
    'import-x/newline-after-import': 'warn',
    'import-x/no-empty-named-blocks': 'warn',
  },
}, {
  files: [
    'src/**/*.ts',
    'tests/**/*.ts',
  ],
  extends: [
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    importX.flatConfigs.typescript,
    eslintPlugin.configs.recommended,
  ],
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    'import-x/consistent-type-specifier-style': 'warn',

    'n/no-missing-import': 'off',

    'eslint-plugin/require-meta-docs-description': [
      'error',
      {
        pattern: '^(Enforce|Require|Disallow)',
      },
    ],
    'eslint-plugin/prefer-placeholders': 'error',
    'eslint-plugin/require-meta-schema-description': 'error',
    'eslint-plugin/test-case-shorthand-strings': ['error', 'never'],
    'eslint-plugin/require-test-case-name': [
      'error',
      {
        require: 'always',
      },
    ],
    'eslint-plugin/unique-test-case-names': 'error',
    'eslint-plugin/no-matching-violation-suggest-message-ids': 'error',

    '@typescript-eslint/no-unnecessary-condition': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
        allowBoolean: true,
        allowAny: true,
        allowNullish: true,
        allowRegExp: true,
        allowNever: true,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}, {
  files: [
    'tests/**/*.ts',
  ],
  extends: [
    vitest.configs.recommended,
  ],
  rules: {
    'vitest/no-conditional-expect': [
      'error',
      {
        expectAssertions: true,
      },
    ],
  },
}, {
  // Don't lint yarn plugins.
  ignores: [
    '.yarn/**',
  ],
}, {
  files: [
    'package.json',
  ],
  extends: [
    packageJson.configs.recommended,
    packageJson.configs.stylistic,
  ],
});
