import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const noCreateRule = ruleCreator({
  meta: {
    docs: {
      description: 'Disallow the static `Observable.create` and `Subject.create` functions.',
      recommended: 'recommended',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Observable.create is forbidden; use new Observable.',
      forbiddenSubject: 'Subject.create is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-create',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      'CallExpression > MemberExpression[object.name=\'Observable\'] > Identifier[name=\'create\']':
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          if (couldBeObservable(memberExpression.object)) {
            context.report({
              messageId: 'forbidden',
              node,
            });
          }
        },
      'CallExpression > MemberExpression[object.name=/^(Subject|BehaviorSubject|AsyncSubject|ReplaySubject)$/] > Identifier[name=\'create\']':
        (node: es.Identifier) => {
          const memberExpression = node.parent as es.MemberExpression;
          if (couldBeType(memberExpression.object, /^(Subject|BehaviorSubject|AsyncSubject|ReplaySubject)$/)) {
            context.report({
              messageId: 'forbiddenSubject',
              node,
            });
          }
        },
    };
  },
});
