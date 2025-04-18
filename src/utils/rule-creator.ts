import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import { version } from '../../package.json';

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
