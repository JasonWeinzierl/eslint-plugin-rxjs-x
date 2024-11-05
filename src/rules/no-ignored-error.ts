import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredErrorRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Disallow calling `subscribe` without specifying an error handler.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Calling subscribe without an error handler is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-error',
  create: (context) => {
    const { couldBeObservable, couldBeFunction } = getTypeServices(context);

    return {
      'CallExpression[arguments.length > 0] > MemberExpression > Identifier[name=\'subscribe\']':
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          const callExpression = memberExpression.parent as es.CallExpression;

          if (
            callExpression.arguments.length < 2
            && couldBeObservable(memberExpression.object)
            && couldBeFunction(callExpression.arguments[0])
          ) {
            context.report({
              messageId: 'forbidden',
              node,
            });
          }
        },
    };
  },
});
