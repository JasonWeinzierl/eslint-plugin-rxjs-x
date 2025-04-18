import { TSESTree as es } from '@typescript-eslint/utils';
import { stripIndent } from 'common-tags';
import { DEFAULT_VALID_POST_COMPLETION_OPERATORS } from '../constants';
import {
  getTypeServices,
} from '../etc';
import { findIsLastOperatorOrderValid, ruleCreator } from '../utils';

const defaultOptions: readonly {
  alias?: string[];
  allow?: string[];
}[] = [];

export const noUnsafeTakeuntilRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow applying operators after `takeUntil`.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Applying operators after takeUntil is forbidden.',
    },
    schema: [
      {
        properties: {
          alias: { type: 'array', items: { type: 'string' }, description: 'An array of operator names that should be treated similarly to `takeUntil`.' },
          allow: { type: 'array', items: { type: 'string' }, description: 'An array of operator names that are allowed to follow `takeUntil`.', default: DEFAULT_VALID_POST_COMPLETION_OPERATORS },
        },
        type: 'object',
        description: stripIndent`
          An optional object with optional \`alias\` and \`allow\` properties.
          The \`alias\` property is an array containing the names of operators that aliases for \`takeUntil\`.
          The \`allow\` property is an array containing the names of the operators that are allowed to follow \`takeUntil\`.`,
      },
    ],
    type: 'problem',
  },
  name: 'no-unsafe-takeuntil',
  create: (context) => {
    let checkedOperatorsRegExp = /^takeUntil$/;
    const [config = {}] = context.options;
    const { alias, allow = DEFAULT_VALID_POST_COMPLETION_OPERATORS } = config;

    if (alias) {
      checkedOperatorsRegExp = new RegExp(
        `^(${alias.concat('takeUntil').join('|')})$`,
      );
    }

    const { couldBeObservable } = getTypeServices(context);

    function checkNode(node: es.CallExpression) {
      const pipeCallExpression = node.parent as es.CallExpression;
      if (
        !pipeCallExpression.arguments
        || !couldBeObservable(pipeCallExpression)
      ) {
        return;
      }

      const { isOrderValid, operatorNode } = findIsLastOperatorOrderValid(
        pipeCallExpression,
        checkedOperatorsRegExp,
        allow,
      );

      if (!isOrderValid && operatorNode) {
        context.report({
          messageId: 'forbidden',
          node: operatorNode,
        });
      }
    }

    return {
      [`CallExpression[callee.property.name='pipe'] > CallExpression[callee.name=${checkedOperatorsRegExp}]`]:
        checkNode,
      [`CallExpression[callee.property.name='pipe'] > CallExpression[callee.property.name=${checkedOperatorsRegExp}]`]:
        checkNode,
    };
  },
});
