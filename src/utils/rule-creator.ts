import { ESLintUtils } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import { version } from '../../package.json';

export interface RxjsXRuleDocs<Options extends readonly unknown[] = []> {
  description: string;
  recommended?: 'recommended' | 'strict' | {
    recommended?: true;
    strict: Partial<Options>;
  };
  requiresTypeChecking?: boolean;
}

const REPO_URL = 'https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x';

export const ruleCreator = ESLintUtils.RuleCreator<RxjsXRuleDocs>(
  (name) =>
    `${REPO_URL}/blob/v${version}/docs/rules/${name}.md`,
// Compatibility until https://github.com/typescript-eslint/typescript-eslint/issues/11543 is addressed.
) as unknown as <Options extends readonly unknown[], MessageIds extends string>({ meta, name, ...rule }: Readonly<ESLintUtils.RuleWithMetaAndName<Options, MessageIds, RxjsXRuleDocs<Options>>>) => Rule.RuleModule;
