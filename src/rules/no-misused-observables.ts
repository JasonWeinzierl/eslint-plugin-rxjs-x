import { TSESLint } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

// The implementation of this rule is similar to typescript-eslint's no-misused-promises. MIT License.
// https://github.com/typescript-eslint/typescript-eslint/blob/fcd6cf063a774f73ea00af23705117a197f826d4/packages/eslint-plugin/src/rules/no-misused-promises.ts

const defaultOptions: readonly {
  checksSpreads?: boolean;
}[] = [];

export const noMisusedObservablesRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow Observables in places not designed to handle them.',
      requiresTypeChecking: true,
    },
    messages: {
      forbiddenSpread: 'Expected a non-Observable value to be spread into an object.',
    },
    schema: [
      {
        properties: {
          checksSpreads: { type: 'boolean', default: true, description: 'Disallow `...` spreading an Observable.' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-misused-observables',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    const [config = {}] = context.options;
    const { checksSpreads = true } = config;

    const spreadChecks: TSESLint.RuleListener = {
      SpreadElement: (node) => {
        if (couldBeObservable(node.argument)) {
          context.report({
            messageId: 'forbiddenSpread',
            node: node.argument,
          });
        }
      },
    };

    return {
      ...(checksSpreads ? spreadChecks : {}),
    };
  },
});
