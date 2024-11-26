import { TSESLint } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

// The implementation of this rule is similar to typescript-eslint's no-misused-promises. MIT License.
// https://github.com/typescript-eslint/typescript-eslint/blob/fcd6cf063a774f73ea00af23705117a197f826d4/packages/eslint-plugin/src/rules/no-misused-promises.ts

const defaultOptions: readonly {
  checksVoidReturn?: boolean;
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
      forbiddenVoidReturnArgument: 'Observable returned in function argument where a void return was expected.',
      forbiddenVoidReturnAttribute: 'Observable-returning function provided to attribute where a void return was expected.',
      forbiddenVoidReturnInheritedMethod: 'Observable-returning method provided where a void return was expected by extended/implemented type \'{{heritageTypeName}}\'.',
      forbiddenVoidReturnProperty: 'Observable-returning function provided to property where a void return was expected.',
      forbiddenVoidReturnReturnValue: 'Observable-returning function provided to return value where a void return was expected.',
      forbiddenVoidReturnVariable: 'Observable-returning function provided to variable where a void return was expected.',
      forbiddenSpread: 'Expected a non-Observable value to be spread into an object.',
    },
    schema: [
      {
        properties: {
          checksVoidReturn: { type: 'boolean', default: true, description: 'Disallow returning an Observable from a function typed as returning `void`.' },
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
    const { checksVoidReturn = true, checksSpreads = true } = config;

    const voidReturnChecks: TSESLint.RuleListener = {

    };

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
      ...(checksVoidReturn ? voidReturnChecks : {}),
      ...(checksSpreads ? spreadChecks : {}),
    };
  },
});
