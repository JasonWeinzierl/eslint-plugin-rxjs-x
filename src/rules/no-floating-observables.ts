import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices, isUnaryExpression } from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  ignoreVoid?: boolean;
}[] = [];

const messageBase
  = 'Observables must be subscribed to, returned, converted to a promise and awaited, '
  + 'or be explicitly marked as ignored with the `void` operator.';

const messageBaseNoVoid
    = 'Observables must be subscribed to, returned, or converted to a promise and awaited.';

export const noFloatingObservablesRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Require Observables to be handled appropriately.',
      recommended: 'strict',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: messageBase,
      forbiddenNoVoid: messageBaseNoVoid,
    },
    schema: [
      {
        properties: {
          ignoreVoid: { type: 'boolean', default: true, description: 'Whether to ignore `void` expressions.' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-floating-observables',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    const [config = {}] = context.options;
    const { ignoreVoid = true } = config;

    return {
      ExpressionStatement: (node: es.ExpressionStatement) => {
        const { expression } = node;
        if (couldBeObservable(expression)) {
          context.report({
            messageId: ignoreVoid ? 'forbidden' : 'forbiddenNoVoid',
            node,
          });
          return;
        }

        if (!ignoreVoid && isUnaryExpression(expression)) {
          const { operator, argument } = expression;
          if (operator === 'void' && couldBeObservable(argument)) {
            context.report({
              messageId: 'forbiddenNoVoid',
              node: argument,
            });
            return;
          }
        }
      },
    };
  },
});
