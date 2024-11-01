import { TSESTree as es } from '@typescript-eslint/utils';
import { ruleCreator } from '../utils';

export const noIndexRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Forbids the importation from index modules.',
      recommended: true,
    },
    messages: {
      forbidden: 'RxJS imports from index modules are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-index',
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs(?:\u002f\w+)?\u002findex/]`]:
        (node: es.Literal) => {
          context.report({
            messageId: 'forbidden',
            node,
          });
        },
    };
  },
});
