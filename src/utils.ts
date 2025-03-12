import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import { version } from '../package.json';

export function createRegExpForWords(
  config: string | string[],
): RegExp | undefined {
  if (!config?.length) {
    return undefined;
  }
  const flags = 'i';
  if (typeof config === 'string') {
    return new RegExp(config, flags);
  }
  const words = config;
  const joined = words.map((word) => String.raw`(\b|_)${word}(\b|_)`).join('|');
  return new RegExp(`(${joined})`, flags);
}

export function escapeRegExp(text: string): string {
  // https://stackoverflow.com/a/3561711/6680611
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export interface RxjsXRuleDocs {
  description: string;
  recommended?: TSESLint.RuleRecommendation | TSESLint.RuleRecommendationAcrossConfigs<unknown[]>;
  requiresTypeChecking?: boolean;
}

const REPO_URL = 'https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x';

export const ruleCreator = ESLintUtils.RuleCreator<RxjsXRuleDocs>(
  (name) =>
    `${REPO_URL}/blob/v${version}/docs/rules/${name}.md`,
);
