import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noTopromiseRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow use of the `toPromise` method.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'The toPromise method is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-topromise',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);
    return {
      [`MemberExpression[property.name="toPromise"]`]: (
        node: es.MemberExpression,
      ) => {
        if (couldBeObservable(node.object)) {
          context.report({
            messageId: 'forbidden',
            node: node.property,
          });
        }
      },
    };
  },
});
