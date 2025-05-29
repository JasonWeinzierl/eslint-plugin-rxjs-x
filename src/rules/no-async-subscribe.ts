import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices, isArrowFunctionExpression, isFunctionExpression } from '../etc';
import { ruleCreator } from '../utils';

export const noAsyncSubscribeRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow passing `async` functions to `subscribe`.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Passing async functions to subscribe is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-async-subscribe',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    function report(
      node: es.FunctionExpression | es.ArrowFunctionExpression,
    ) {
      const { loc } = node;
      // only report the `async` keyword
      const asyncLoc = {
        ...loc,
        end: {
          ...loc.start,
          column: loc.start.column + 5,
        },
      };

      context.report({
        messageId: 'forbidden',
        loc: asyncLoc,
      });
    }

    function checkSingleNext(
      funcNode: es.FunctionExpression | es.ArrowFunctionExpression,
    ) {
      const parentNode = funcNode.parent as es.CallExpression;
      const callee = parentNode.callee as es.MemberExpression;

      if (couldBeObservable(callee.object)) {
        report(funcNode);
      }
    }

    function checkObserverObjectProp(
      propNode: es.Property,
    ) {
      const parentNode = propNode.parent.parent as es.CallExpression;
      const callee = parentNode.callee as es.MemberExpression;

      if (couldBeObservable(callee.object)
        && (isArrowFunctionExpression(propNode.value)
          || isFunctionExpression(propNode.value))
      ) {
        report(propNode.value);
      }
    }

    return {
      'CallExpression[callee.property.name=\'subscribe\'] > FunctionExpression[async=true]':
        checkSingleNext,
      'CallExpression[callee.property.name=\'subscribe\'] > ArrowFunctionExpression[async=true]':
        checkSingleNext,
      'CallExpression[callee.property.name=\'subscribe\'] > ObjectExpression > Property[key.name=\'next\'][value.type="ArrowFunctionExpression"][value.async=true]':
        checkObserverObjectProp,
      'CallExpression[callee.property.name=\'subscribe\'] > ObjectExpression > Property[key.name=\'next\'][value.type="FunctionExpression"][value.async=true]':
        checkObserverObjectProp,
    };
  },
});
