import { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const noImportOperatorsRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow importing operators from `rxjs/operators`.',
    },
    hasSuggestions: true,
    messages: {
      forbidden: 'RxJS imports from `rxjs/operators` are forbidden.',
      suggest: 'Import from `rxjs` instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-import-operators',
  create: (context) => {
    function getReplacement(rawLocation: string) {
      const match = /^\s*('|")/.exec(rawLocation);
      if (!match) {
        return undefined;
      }
      const [, quote] = match;
      if (/^['"]rxjs\/operators/.test(rawLocation)) {
        return `${quote}rxjs${quote}`;
      }
      return undefined;
    }

    function reportNode(node: es.Literal) {
      const replacement = getReplacement(node.raw);
      if (replacement) {
        context.report({
          messageId: 'forbidden',
          node,
          suggest: [{ messageId: 'suggest', fix: (fixer) => fixer.replaceText(node, replacement) }],
        });
      } else {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }
    }

    return {
      'ImportDeclaration Literal[value="rxjs/operators"]': (node: es.Literal) => {
        reportNode(node);
      },
      'ImportExpression Literal[value="rxjs/operators"]': (node: es.Literal) => {
        reportNode(node);
      },
      'ExportNamedDeclaration Literal[value="rxjs/operators"]': (node: es.Literal) => {
        reportNode(node);
      },
      'ExportAllDeclaration Literal[value="rxjs/operators"]': (node: es.Literal) => {
        reportNode(node);
      },
    };
  },
});
