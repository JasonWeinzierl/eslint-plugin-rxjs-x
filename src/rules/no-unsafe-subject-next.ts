import { TSESTree as es } from '@typescript-eslint/utils';
import * as tsutils from 'tsutils';
import { couldBeType, isReferenceType, isUnionType } from 'tsutils-etc';
import * as ts from 'typescript';
import {
  getTypeServices,
  isMemberExpression } from '../etc';
import { ruleCreator } from '../utils';

export const noUnsafeSubjectNext = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Forbids unsafe optional `next` calls.',
      recommended: true,
    },
    fixable: undefined,
    hasSuggestions: false,
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
          if (isReferenceType(type) && couldBeType(type, 'Subject')) {
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
              isUnionType(typeArg)
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
