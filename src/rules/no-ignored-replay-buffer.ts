import { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const noIgnoredReplayBufferRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.',
      recommended: true,
    },
    messages: {
      forbidden: 'Ignoring the buffer size is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-replay-buffer',
  create: (context) => {
    function checkNode(
      node: es.Node,
      { arguments: args }: { arguments: es.Node[] },
    ) {
      if (!args || args.length === 0) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }
    }

    return {
      'NewExpression > Identifier[name=\'ReplaySubject\']': (
        node: es.Identifier,
      ) => {
        const newExpression = node.parent as es.NewExpression;
        checkNode(node, newExpression);
      },
      'NewExpression > MemberExpression > Identifier[name=\'ReplaySubject\']': (
        node: es.Identifier,
      ) => {
        const memberExpression = node.parent as es.MemberExpression;
        const newExpression = memberExpression.parent as es.NewExpression;
        checkNode(node, newExpression);
      },
      'CallExpression > Identifier[name=/^(publishReplay|shareReplay)$/]': (
        node: es.Identifier,
      ) => {
        const callExpression = node.parent as es.CallExpression;
        checkNode(node, callExpression);
      },
    };
  },
});
