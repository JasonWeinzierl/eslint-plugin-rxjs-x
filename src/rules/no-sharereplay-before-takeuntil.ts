import { TSESTree as es } from '@typescript-eslint/utils';
import { DEFAULT_VALID_POST_COMPLETION_OPERATORS } from '../constants';
import { isIdentifier, isLiteral, isMemberExpression, isObjectExpression, isProperty } from '../etc';
import { findIsLastOperatorOrderValid, ruleCreator } from '../utils';

const defaultOptions: readonly {
  takeUntilAlias?: string[];
}[] = [];

export const noSharereplayBeforeTakeuntilRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow using `shareReplay({ refCount: false })` before `takeUntil`.',
      recommended: 'strict',
    },
    messages: {
      forbidden: 'shareReplay before takeUntil is forbidden unless \'refCount: true\' is specified.',
      forbiddenWithTakeUntilAlias: 'shareReplay before takeUntil (or its alias) is forbidden unless \'refCount: true\' is specified.',
    },
    schema: [{
      properties: {
        takeUntilAlias: { type: 'array', description: 'List of operators to treat as takeUntil.', default: ['takeUntilDestroyed'] },
      },
      type: 'object',
    }],
    type: 'problem',
  },
  name: 'no-sharereplay-before-takeuntil',
  create: (context) => {
    const [config = {}] = context.options;
    const { takeUntilAlias = ['takeUntilDestroyed'] } = config;
    function checkCallExpression(node: es.CallExpression) {
      const pipeCallExpression = node.parent as es.CallExpression;
      if (
        !pipeCallExpression.arguments
        || !isMemberExpression(pipeCallExpression.callee)
        || !isIdentifier(pipeCallExpression.callee.property)
        || pipeCallExpression.callee.property.name !== 'pipe'
      ) {
        return;
      }

      const takeUntilRegex = new RegExp(`^(takeUntil$|${takeUntilAlias.join('$|')}$)`);

      const { isOrderValid, operatorNode: takeUntilNode } = findIsLastOperatorOrderValid(
        pipeCallExpression,
        takeUntilRegex,
        DEFAULT_VALID_POST_COMPLETION_OPERATORS,
      );
      if (!isOrderValid || !takeUntilNode) {
        // takeUntil is not present or in an unsafe position itself.
        return;
      }

      if (takeUntilNode.range[0] < node.range[0]) {
        // takeUntil is before shareReplay.
        return;
      }

      const shareReplayConfig = node.arguments[0];
      if (
        !shareReplayConfig
        || !isObjectExpression(shareReplayConfig)
      ) {
        // refCount defaults to false if no config is provided.
        context.report({
          messageId: 'forbidden',
          node: node.callee,
        });
        return;
      }

      const refCountElement = shareReplayConfig.properties
        .filter(isProperty)
        .find(prop =>
          isIdentifier(prop.key)
          && prop.key.name === 'refCount');
      if (
        !refCountElement
        || (isLiteral(refCountElement.value)
          && refCountElement.value.value === false)
      ) {
        context.report({
          messageId: takeUntilAlias.length > 0 ? 'forbiddenWithTakeUntilAlias' : 'forbidden',
          node: node.callee,
        });
      }
    }

    return {
      'CallExpression[callee.name="shareReplay"]': (node: es.CallExpression) => {
        checkCallExpression(node);
      },
      'CallExpression[callee.property.name="shareReplay"]': (node: es.CallExpression) => {
        checkCallExpression(node);
      },
    };
  },
});
