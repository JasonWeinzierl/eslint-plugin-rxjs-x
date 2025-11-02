import {
  TSESTree as es,
} from '@typescript-eslint/utils';
import { MULTIPLE_OBSERVABLE_ACCEPTING_STATIC_OBSERVABLE_CREATORS, SOURCES_OBJECT_ACCEPTING_STATIC_OBSERVABLE_CREATORS } from '../constants';
import { getTypeServices, isArrayExpression, isObjectExpression, isProperty } from '../etc';
import { ruleCreator } from '../utils';

export const noUnnecessaryCollectionRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow unnecessary usage of collection arguments with single values.',
      recommended: 'strict',
      requiresTypeChecking: false,
    },
    messages: {
      forbidden: 'Unnecessary {{operator}} with {{inputType}}. Use the observable directly instead.',
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'no-unnecessary-collection',
  create: (context) => {
    const { couldBeType, couldBeObservable } = getTypeServices(context);

    function couldBeFromRxjs(node: es.Node, operatorName: string): boolean {
      return couldBeType(node, operatorName, { name: /[/\\]rxjs[/\\]/ });
    }

    function checkCallExpression(node: es.CallExpression, operatorName: string): void {
      const args = node.arguments;

      if (args.length === 0) {
        return;
      }

      const firstArg = args[0];

      // Single-valued array.
      if (isArrayExpression(firstArg)) {
        const nonNullElements = firstArg.elements.filter(element => element !== null);
        if (nonNullElements.length === 1 && couldBeObservable(nonNullElements[0])) {
          context.report({
            messageId: 'forbidden',
            node: node.callee,
            data: {
              operator: operatorName,
              inputType: 'single-valued array',
            },
          });
        }
        return;
      }

      // Single-property object.
      if (isObjectExpression(firstArg) && SOURCES_OBJECT_ACCEPTING_STATIC_OBSERVABLE_CREATORS.includes(operatorName)) {
        if (firstArg.properties.length === 1 && isProperty(firstArg.properties[0])) {
          const property = firstArg.properties[0];
          if (property.value && couldBeObservable(property.value)) {
            context.report({
              messageId: 'forbidden',
              node: node.callee,
              data: {
                operator: operatorName,
                inputType: 'single-property object',
              },
            });
          }
        }
        return;
      }

      // Single rest parameter argument.
      if (args.length === 1 && couldBeObservable(firstArg)) {
        context.report({
          messageId: 'forbidden',
          node: node.callee,
          data: {
            operator: operatorName,
            inputType: 'single argument',
          },
        });
      }
    }

    const callExpressionVisitors: Record<string, (node: es.CallExpression) => void> = {};

    for (const operator of MULTIPLE_OBSERVABLE_ACCEPTING_STATIC_OBSERVABLE_CREATORS) {
      callExpressionVisitors[`CallExpression[callee.name="${operator}"]`] = (node: es.CallExpression) => {
        if (couldBeFromRxjs(node.callee, operator)) {
          checkCallExpression(node, operator);
        }
      };
    }

    for (const operator of MULTIPLE_OBSERVABLE_ACCEPTING_STATIC_OBSERVABLE_CREATORS) {
      callExpressionVisitors[`CallExpression[callee.type="MemberExpression"][callee.property.name="${operator}"]`] = (node: es.CallExpression) => {
        const memberExpr = node.callee as es.MemberExpression;
        if (couldBeFromRxjs(memberExpr.property, operator)) {
          checkCallExpression(node, operator);
        }
      };
    }

    return callExpressionVisitors;
  },
});
