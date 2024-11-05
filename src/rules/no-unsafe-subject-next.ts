import { TSESTree as es } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import * as ts from 'typescript';
import {
  couldBeType,
  getTypeServices,
  isMemberExpression } from '../etc';
import { ruleCreator } from '../utils';

export const noUnsafeSubjectNext = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow unsafe optional `next` calls.',
      recommended: true,
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Unsafe optional next calls are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-unsafe-subject-next',
  create: (context) => {
    const { getType, typeChecker } = getTypeServices(context);
    return {
      [`CallExpression[callee.property.name='next']`]: (
        node: es.CallExpression,
      ) => {
        if (node.arguments.length === 0 && isMemberExpression(node.callee)) {
          const type = getType(node.callee.object);
          if (tsutils.isTypeReference(type) && couldBeType(type, 'Subject')) {
            const [typeArg] = typeChecker.getTypeArguments(type);
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Any)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Unknown)) {
              return;
            }
            if (tsutils.isTypeFlagSet(typeArg, ts.TypeFlags.Void)) {
              return;
            }
            if (
              tsutils.isUnionType(typeArg)
              && typeArg.types.some((t) =>
                tsutils.isTypeFlagSet(t, ts.TypeFlags.Void),
              )
            ) {
              return;
            }
            context.report({
              messageId: 'forbidden',
              node: node.callee.property,
            });
          }
        }
      },
    };
  },
});
