import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noFloatingObservablesRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Require Observables to be handled appropriately.',
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden:
        'Observables must be subscribed to, returned, converted to a promise and awaited, '
        + 'or be explicitly marked as ignored with the `void` operator.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-floating-observables',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    return {
      'ExpressionStatement > CallExpression': (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          context.report({
            messageId: 'forbidden',
            node,
          });
        }
      },
    };
  },
});
