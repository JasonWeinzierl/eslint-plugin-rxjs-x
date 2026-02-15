import { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import { version } from '../../package.json';

export interface RxjsXRuleDocs<Options extends readonly unknown[], Desc extends string> {
  description: Desc;
  recommended?: TSESLint.RuleRecommendation | TSESLint.RuleRecommendationAcrossConfigs<Options>;
  requiresTypeChecking?: boolean;
}

const REPO_URL = 'https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x';

export const ruleCreator = ESLintUtils.RuleCreator<RxjsXRuleDocs<unknown[], string>>(
  (name) =>
    `${REPO_URL}/blob/v${version}/docs/rules/${name}.md`,
// Ensure the resulting types are narrowed to exactly what each rule declares.
) as <
  MessageIds extends string,
  Desc extends string,
  Docs extends RxjsXRuleDocs<Options, Desc>,
  Options extends readonly unknown[] = readonly [],
>({ meta, name, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds, Docs>>) => TSESLint.RuleModule<MessageIds, Options, Docs>;
