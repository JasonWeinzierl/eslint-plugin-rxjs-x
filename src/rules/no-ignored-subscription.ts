import { TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { DEFAULT_VALID_POST_COMPLETION_OPERATORS } from '../constants';
import { getTypeServices, isCallExpression, isIdentifier, isMemberExpression } from '../etc';
import { findIsLastOperatorOrderValid, ruleCreator } from '../utils';

const defaultOptions: readonly {
  lastOperators?: string[];
  allowAfterLastOperators?: string[];
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
          lastOperators: { type: 'array', items: { type: 'string' }, description: 'An array of operator names that will handle unsubscribing if last.', default: ['takeUntil', 'takeWhile', 'take', 'first', 'last', 'takeUntilDestroyed'] },
          allowAfterLastOperators: { type: 'array', items: { type: 'string' }, description: 'An array of operator names that are allowed to follow the last operators.', default: DEFAULT_VALID_POST_COMPLETION_OPERATORS },
        },
        type: 'object',
        description: stripIndent`
          An object with optional \`lastOperators\` and \`allowAfterLastOperators\` properties.
          The \`lastOperators\` property is an array containing the names of operators that will handle unsubscribing if last.
          The \`allowAfterLastOperators\` property is an array containing the names of the operators that are allowed to follow the last operators.
        `,
      },
    ],
    type: 'problem',
  },
  name: 'no-ignored-subscription',
  create: (context) => {
    const [config = {}] = context.options;
    const {
      lastOperators = ['takeUntil', 'takeWhile', 'take', 'first', 'last', 'takeUntilDestroyed'],
      allowAfterLastOperators = DEFAULT_VALID_POST_COMPLETION_OPERATORS,
    } = config;

    const checkedOperatorsRegExp = new RegExp(
      `^(${lastOperators.join('|')})$`,
    );

    const { couldBeObservable, couldBeType } = getTypeServices(context);

    function hasAllowedOperator(node: es.Node): boolean {
      if (
        isCallExpression(node)
        && isMemberExpression(node.callee)
        && isIdentifier(node.callee.property)
        && node.callee.property.name === 'pipe'
      ) {
        // Only ignore the subscription if an allowed operator is last (excluding allowed after-last operators).
        const { isOrderValid, operatorNode } = findIsLastOperatorOrderValid(
          node,
          checkedOperatorsRegExp,
          allowAfterLastOperators,
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
