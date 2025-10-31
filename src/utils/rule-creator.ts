import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import { version } from '../../package.json';

export interface RxjsXRuleDocs<Options extends readonly unknown[]> {
  description: string;
  recommended?: TSESLint.RuleRecommendation | TSESLint.RuleRecommendationAcrossConfigs<Options>;
  requiresTypeChecking?: boolean;
}

const REPO_URL = 'https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x';

export const ruleCreator = ESLintUtils.RuleCreator<RxjsXRuleDocs<unknown[]>>(
  (name) =>
    `${REPO_URL}/blob/v${version}/docs/rules/${name}.md`,
// Ensure the Options type is passed to RxjsXRuleDocs.
) as <
  Options extends readonly unknown[],
  MessageIds extends string,
>({ meta, name, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds, RxjsXRuleDocs<Options>>>) => TSESLint.RuleModule<MessageIds, Options, RxjsXRuleDocs<Options>>;
