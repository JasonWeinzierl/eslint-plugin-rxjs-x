import { TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { defaultObservable } from '../constants';
import { getTypeServices, isCallExpression, isIdentifier } from '../etc';
import { ruleCreator } from '../utils';

type Options = readonly [{
  observable?: string;
}];

export const noUnsafeFirstRule = ruleCreator({
  meta: {
    docs: {
      description: 'Disallow unsafe `first`/`take` usage in effects and epics.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden:
        'Unsafe first and take usage in effects and epics are forbidden.',
    },
    schema: [
      {
        properties: {
          observable: { type: 'string', description: 'A RegExp that matches an effect or epic\'s actions observable.' },
        },
        type: 'object',
        description: stripIndent`
          An optional object with an optional \`observable\` property.
          The property can be specified as a regular expression string and is used to identify the action observables from which effects and epics are composed.`,
      },
    ],
    type: 'problem',
    defaultOptions: [{
      observable: defaultObservable,
    }] as Options,
  },
  name: 'no-unsafe-first',
  create: (context) => {
    const invalidOperatorsRegExp = /^(take|first)$/;

    const [{ observable = defaultObservable }] = context.options;
    const observableRegExp = new RegExp(observable);

    const { couldBeObservable } = getTypeServices(context);
    const nodes: es.CallExpression[] = [];

    function checkNode(node: es.CallExpression) {
      if (!node.arguments || !couldBeObservable(node)) {
        return;
      }

      node.arguments.forEach((arg) => {
        if (isCallExpression(arg) && isIdentifier(arg.callee)) {
          if (invalidOperatorsRegExp.test(arg.callee.name)) {
            context.report({
              messageId: 'forbidden',
              node: arg.callee,
            });
          }
        }
      });
    }

    return {
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]`]:
        (node: es.CallExpression) => {
          if (nodes.push(node) === 1) {
            checkNode(node);
          }
        },
      [`CallExpression[callee.property.name='pipe'][callee.object.name=${observableRegExp}]:exit`]:
        () => {
          nodes.pop();
        },
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]`]:
        (node: es.CallExpression) => {
          if (nodes.push(node) === 1) {
            checkNode(node);
          }
        },
      [`CallExpression[callee.property.name='pipe'][callee.object.property.name=${observableRegExp}]:exit`]:
        () => {
          nodes.pop();
        },
    };
  },
});
