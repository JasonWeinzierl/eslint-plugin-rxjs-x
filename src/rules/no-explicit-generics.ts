import { TSESTree as es } from '@typescript-eslint/utils';
import { isArrayExpression, isObjectExpression, isUnionType } from '../etc';
import { ruleCreator } from '../utils';

export const noExplicitGenericsRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow unnecessary explicit generic type arguments.',
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

    function checkBehaviorSubjects(node: es.Node) {
      const parent = node.parent as es.NewExpression;
      const {
        arguments: [value],
      } = parent;

      const typeArgs = parent.typeArguments?.params[0];
      if (isArrayExpression(value) || isObjectExpression(value) || (typeArgs && isUnionType(typeArgs))) {
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
      if (isArrayExpression(value) || isObjectExpression(value) || (typeArgs && isUnionType(typeArgs))) {
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
