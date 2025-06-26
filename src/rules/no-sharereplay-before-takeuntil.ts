import { TSESTree as es } from '@typescript-eslint/utils';
import { isCallExpression, isIdentifier, isLiteral, isMemberExpression, isObjectExpression, isProperty } from '../etc';
import { ruleCreator } from '../utils';

export const noSharereplayBeforeTakeuntilRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow using `shareReplay({ refCount: false })` before `takeUntil`.',
    },
    messages: {
      forbidden: 'shareReplay before takeUntil is forbidden unless \'refCount: true\' is specified.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-sharereplay-before-takeuntil',
  create: (context) => {
    return {
      'CallExpression[callee.name="shareReplay"]': (node: es.CallExpression) => {
        const pipeCallExpression = node.parent as es.CallExpression;
        if (
          !pipeCallExpression.arguments
          || !isMemberExpression(pipeCallExpression.callee)
          || !isIdentifier(pipeCallExpression.callee.property)
          || pipeCallExpression.callee.property.name !== 'pipe'
        ) {
          return;
        }

        const takeUntilIndex = pipeCallExpression.arguments.findIndex(arg =>
          isCallExpression(arg)
          && isIdentifier(arg.callee)
          && arg.callee.name === 'takeUntil',
        );

        if (takeUntilIndex === -1) {
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
            messageId: 'forbidden',
            node: node.callee,
          });
        }
      },
    };
  },
});
