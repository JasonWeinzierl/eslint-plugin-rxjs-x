import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import { isArrayExpression, isObjectExpression, isUnionType } from '../etc';
import { ruleCreator } from '../utils';

export const noExplicitGenericsRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow unnecessary explicit generic type arguments.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Explicit generic type arguments are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-explicit-generics',
  create: (context) => {
    function report(node: es.Node) {
      context.report({
        messageId: 'forbidden',
        node,
      });
    }

    /**
     * Checks if a node is a union type, either explicitly (AST) or implicitly (TypeChecker).
     */
    function isUnion(node: es.Node | undefined): boolean {
      if (!node) {
        return false;
      }

      if (isUnionType(node)) {
        return true;
      }

      const { getTypeAtLocation } = ESLintUtils.getParserServices(context);
      const type = getTypeAtLocation(node);

      return tsutils.isUnionOrIntersectionType(type);
    }

    function checkBehaviorSubjects(node: es.Node) {
      const parent = node.parent as es.NewExpression;
      const {
        arguments: [value],
      } = parent;

      const typeArgs = parent.typeArguments?.params[0];

      if (isArrayExpression(value) || isObjectExpression(value) || isUnion(typeArgs)) {
        return;
      }

      report(node);
    }

    function checkNotifications(node: es.Node) {
      const parent = node.parent as es.NewExpression;
      const {
        arguments: [, value],
      } = parent;

      const typeArgs = parent.typeArguments?.params[0];

      if (isArrayExpression(value) || isObjectExpression(value) || isUnion(typeArgs)) {
        return;
      }

      report(node);
    }

    return {
      'CallExpression[callee.property.name=\'pipe\'] > CallExpression[typeArguments.params.length > 0] > Identifier':
        report,
      'NewExpression[typeArguments.params.length > 0] > Identifier[name=\'BehaviorSubject\']':
        checkBehaviorSubjects,
      'CallExpression[typeArguments.params.length > 0] > Identifier[name=/^(from|of)$/]':
        report,
      'NewExpression[typeArguments.params.length > 0][arguments.0.value=\'N\'] > Identifier[name=\'Notification\']':
        checkNotifications,
    };
  },
});
