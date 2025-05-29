import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import ts from 'typescript';
import { couldBeFunction, couldBeType, getTypeServices, isMemberExpression } from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  allowThrowingAny?: boolean;
  allowThrowingUnknown?: boolean;
}[] = [];

export const throwErrorRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description:
        'Enforce passing only `Error` values to `throwError`.',
      recommended: {
        recommended: true,
        strict: [{ allowThrowingAny: false, allowThrowingUnknown: false }],
      },
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Passing non-Error values is forbidden.',
    },
    schema: [
      {
        properties: {
          allowThrowingAny: { type: 'boolean', default: true, description: 'Whether to always allow throwing values typed as `any`.' },
          allowThrowingUnknown: { type: 'boolean', default: true, description: 'Whether to always allow throwing values typed as `unknown`.' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'throw-error',
  create: (context) => {
    const { esTreeNodeToTSNodeMap, program, getTypeAtLocation } = ESLintUtils.getParserServices(context);
    const { couldBeObservable, couldBeSubject } = getTypeServices(context);
    const [config = {}] = context.options;
    const { allowThrowingAny = true, allowThrowingUnknown = true } = config;

    function checkThrowArgument(node: es.Node, noFunction = false) {
      let type = getTypeAtLocation(node);
      let reportNode = node;

      if (!noFunction && couldBeFunction(type)) {
        reportNode = (node as es.ArrowFunctionExpression).body ?? node;

        const tsNode = esTreeNodeToTSNodeMap.get(node);
        const annotation = (tsNode as ts.ArrowFunction).type;
        const body = (tsNode as ts.ArrowFunction).body;
        type = program.getTypeChecker().getTypeAtLocation(annotation ?? body);
      }

      if (allowThrowingAny && tsutils.isIntrinsicAnyType(type)) {
        return;
      }

      if (allowThrowingUnknown && tsutils.isIntrinsicUnknownType(type)) {
        return;
      }

      if (couldBeType(type, /^Error$/)) {
        return;
      }

      context.report({
        messageId: 'forbidden',
        node: reportNode,
      });
    }

    function checkThrowError(node: es.CallExpression) {
      if (couldBeObservable(node)) {
        const [arg] = node.arguments;
        if (arg) {
          checkThrowArgument(arg);
        }
      }
    }

    function checkSubjectError(node: es.CallExpression) {
      if (isMemberExpression(node.callee) && couldBeSubject(node.callee.object)) {
        const [arg] = node.arguments;
        if (arg) {
          checkThrowArgument(arg, true);
        }
      }
    }

    return {
      'CallExpression[callee.name=\'throwError\']':
        checkThrowError,
      'CallExpression[callee.property.name=\'throwError\']':
        checkThrowError,
      'CallExpression[callee.property.name=\'error\']':
        checkSubjectError,
    };
  },
});
