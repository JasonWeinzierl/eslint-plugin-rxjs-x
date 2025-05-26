import { TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { DEFAULT_VALID_POST_COMPLETION_OPERATORS } from '../constants';
import { getTypeServices, isCallExpression, isIdentifier, isMemberExpression } from '../etc';
import { findIsLastOperatorOrderValid, ruleCreator } from '../utils';

const defaultOptions: readonly {
  completers?: string[];
  postCompleters?: string[];
}[] = [];

export const noIgnoredSubscriptionRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow ignoring the subscription returned by `subscribe`.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Ignoring returned subscriptions is forbidden.',
    },
    schema: [
      {
        properties: {
          completers: { type: 'array', items: { type: 'string' }, description: 'An array of operator names that will complete the observable and silence this rule.', default: ['takeUntil', 'takeWhile', 'take', 'first', 'last', 'takeUntilDestroyed'] },
          postCompleters: { type: 'array', items: { type: 'string' }, description: 'An array of operator names that are allowed to follow the completion operators.', default: DEFAULT_VALID_POST_COMPLETION_OPERATORS },
        },
        type: 'object',
        description: stripIndent`
          An object with optional \`completers\` and \`postCompleters\` properties.
          The \`completers\` property is an array containing the names of operators that will complete the observable and silence this rule.
          The \`postCompleters\` property is an array containing the names of the operators that are allowed to follow the completion operators.
        `,
      },
    ],
    type: 'problem',
  },
  name: 'no-ignored-subscription',
  create: (context) => {
    const [config = {}] = context.options;
    const {
      completers = ['takeUntil', 'takeWhile', 'take', 'first', 'last', 'takeUntilDestroyed'],
      postCompleters = DEFAULT_VALID_POST_COMPLETION_OPERATORS,
    } = config;

    const checkedOperatorsRegExp = new RegExp(
      `^(${completers.join('|')})$`,
    );

    const { couldBeObservable, couldBeType } = getTypeServices(context);

    function hasAllowedOperator(node: es.Node): boolean {
      if (
        isCallExpression(node)
        && isMemberExpression(node.callee)
        && isIdentifier(node.callee.property)
        && node.callee.property.name === 'pipe'
      ) {
        // Only ignore the subscription if an allowed completion operator is last (excluding allowed post-completion operators).
        const { isOrderValid, operatorNode } = findIsLastOperatorOrderValid(
          node,
          checkedOperatorsRegExp,
          postCompleters,
        );

        return isOrderValid && !!operatorNode;
      }

      return false;
    }

    return {
      'ExpressionStatement > CallExpression > MemberExpression[property.name=\'subscribe\']':
        (node: es.MemberExpression) => {
          if (couldBeObservable(node.object)) {
            const callExpression = node.parent as es.CallExpression;
            if (
              callExpression.arguments.length === 1
              && couldBeType(callExpression.arguments[0], 'Subscriber')
            ) {
              return;
            }

            if (hasAllowedOperator(node.object)) {
              return;
            }

            context.report({
              messageId: 'forbidden',
              node: node.property,
            });
          }
        },
    };
  },
});
