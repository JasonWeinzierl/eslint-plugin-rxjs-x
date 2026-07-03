import { TSESTree as es } from '@typescript-eslint/utils';
import { isIdentifier, isObjectExpression, isProperty } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredReplayBufferRule = ruleCreator({
  meta: {
    docs: {
      description:
        'Disallow using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.',
      recommended: 'recommended',
    },
    messages: {
      forbidden: 'Ignoring the buffer size is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-replay-buffer',
  create: (context) => {
    function isBufferSizeProperty(property: es.Node): boolean {
      return isProperty(property)
        && isIdentifier(property.key)
        && property.key.name === 'bufferSize';
    }

    function checkShareReplayConfig(
      node: es.Identifier,
      shareReplayConfigArg: es.ObjectExpression,
    ) {
      if (shareReplayConfigArg.properties.every(p => !isBufferSizeProperty(p))) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }
    }

    function checkNode(
      node: es.Identifier,
      { arguments: args }: es.NewExpression | es.CallExpression,
    ) {
      if (!args || args.length === 0) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }

      if (node.name === 'shareReplay' && args?.length === 1) {
        const [arg] = args;
        if (isObjectExpression(arg)) {
          checkShareReplayConfig(node, arg);
        }
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
      'CallExpression > MemberExpression > Identifier[name=/^(publishReplay|shareReplay)$/]': (
        node: es.Identifier,
      ) => {
        const memberExpression = node.parent as es.MemberExpression;
        const callExpression = memberExpression.parent as es.CallExpression;
        checkNode(node, callExpression);
      },
    };
  },
});
