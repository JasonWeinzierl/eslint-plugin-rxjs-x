import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import ts from 'typescript';
import { couldBeFunction, couldBeType, getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

export const throwErrorRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        'Enforce passing only `Error` values to error notifications.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Passing non-Error values are forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'throw-error',
  create: (context) => {
    const { esTreeNodeToTSNodeMap, program, getTypeAtLocation } = ESLintUtils.getParserServices(context);
    const { couldBeObservable } = getTypeServices(context);

    function checkNode(node: es.Node) {
      let type = getTypeAtLocation(node);
      if (couldBeFunction(type)) {
        const tsNode = esTreeNodeToTSNodeMap.get(node);
        const annotation = (tsNode as ts.ArrowFunction).type;
        const body = (tsNode as ts.ArrowFunction).body;
        type = program.getTypeChecker().getTypeAtLocation(annotation ?? body);
      }
      if (
        !tsutils.isIntrinsicAnyType(type)
        && !tsutils.isIntrinsicUnknownType(type)
        && !couldBeType(type, /^(Error|DOMException)$/)
      ) {
        context.report({
          messageId: 'forbidden',
          node,
        });
      }
    }

    return {
      'ThrowStatement > *': checkNode,
      'CallExpression[callee.name=\'throwError\']': (node: es.CallExpression) => {
        if (couldBeObservable(node)) {
          const [arg] = node.arguments;
          if (arg) {
            checkNode(arg);
          }
        }
      },
    };
  },
});
