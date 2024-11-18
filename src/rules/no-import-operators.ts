import { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const noImportOperatorsRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow importing operators from `rxjs/operators`.',
    },
    messages: {
      forbidden: 'RxJS imports from `rxjs/operators` are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-import-operators',
  create: (context) => {
    return {
      'ImportDeclaration Literal[value="rxjs/operators"]': (node: es.Literal) => {
        context.report({
          messageId: 'forbidden',
          node,
        });
      },
      'ImportExpression Literal[value="rxjs/operators"]': (node: es.Literal) => {
        context.report({
          messageId: 'forbidden',
          node,
        });
      },
      'ExportNamedDeclaration Literal[value="rxjs/operators"]': (node: es.Literal) => {
        context.report({
          messageId: 'forbidden',
          node,
        });
      },
      'ExportAllDeclaration Literal[value="rxjs/operators"]': (node: es.Literal) => {
        context.report({
          messageId: 'forbidden',
          node,
        });
      },
    };
  },
});
