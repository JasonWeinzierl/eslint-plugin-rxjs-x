import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredObservableRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow ignoring observables returned by functions.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Ignoring a returned Observable is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-observable',
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
