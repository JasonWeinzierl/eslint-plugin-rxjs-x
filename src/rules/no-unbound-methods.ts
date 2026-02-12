import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import { DEFAULT_UNBOUND_ALLOWED_TYPES } from '../constants';
import {
  couldBeType,
  getTypeServices,
  isCallExpression,
  isMemberExpression,
} from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  allowTypes?: string[];
}[] = [];

export const noUnboundMethodsRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow passing unbound methods.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Unbound methods are forbidden.',
    },
    schema: [
      {
        properties: {
          allowTypes: { type: 'array', items: { type: 'string' }, description: 'An array of function types that are allowed to be passed unbound.', default: DEFAULT_UNBOUND_ALLOWED_TYPES },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-unbound-methods',
  create: (context) => {
    const { getTypeAtLocation } = ESLintUtils.getParserServices(context);
    const { couldBeObservable, couldBeSubscription } = getTypeServices(context);
    const nodeMap = new WeakMap<es.Node, void>();
    const [config = {}] = context.options;
    const { allowTypes = DEFAULT_UNBOUND_ALLOWED_TYPES } = config;

    function mapArguments(node: es.CallExpression | es.NewExpression) {
      node.arguments.filter(isMemberExpression).forEach((arg) => {
        const argType = getTypeAtLocation(arg);

        // Skip if the type matches any of the allowed types.
        if (allowTypes.some(t => couldBeType(argType, t))) {
          return;
        }

        if (argType.getCallSignatures().length > 0) {
          nodeMap.set(arg);
        }
      });
    }

    function isObservableOrSubscription(
      node: es.CallExpression,
      action: (node: es.CallExpression) => void,
    ) {
      if (!isMemberExpression(node.callee)) {
        return;
      }

      if (
        couldBeObservable(node.callee.object)
        || couldBeSubscription(node.callee.object)
      ) {
        action(node);
      }
    }

    return {
      'CallExpression[callee.property.name=\'pipe\']': (
        node: es.CallExpression,
      ) => {
        isObservableOrSubscription(node, ({ arguments: args }) => {
          args.filter(isCallExpression).forEach(mapArguments);
        });
      },
      'CallExpression[callee.property.name=/^(add|subscribe)$/]': (
        node: es.CallExpression,
      ) => {
        isObservableOrSubscription(node, mapArguments);
      },
      'NewExpression[callee.name=\'Subscription\']': mapArguments,
      'ThisExpression': (node: es.ThisExpression) => {
        let parent = node.parent as es.Node | undefined;
        while (parent) {
          if (nodeMap.has(parent)) {
            context.report({
              messageId: 'forbidden',
              node: parent,
            });
            return;
          }
          parent = parent.parent;
        }
      },
    };
  },
});
