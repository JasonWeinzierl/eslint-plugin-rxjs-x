import { TSESTree as es, TSESLint as eslint, ESLintUtils } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import ts from 'typescript';
import { getTypeServices, isJSXExpressionContainer, isMethodDefinition, isPropertyDefinition } from '../etc';
import { ruleCreator } from '../utils';

// The implementation of this rule is similar to typescript-eslint's no-misused-promises. MIT License.
// https://github.com/typescript-eslint/typescript-eslint/blob/fcd6cf063a774f73ea00af23705117a197f826d4/packages/eslint-plugin/src/rules/no-misused-promises.ts

const defaultOptions: readonly {
  checksVoidReturn?: boolean;
  checksSpreads?: boolean;
}[] = [];

export const noMisusedObservablesRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Disallow Observables in places not designed to handle them.',
      requiresTypeChecking: true,
    },
    messages: {
      forbiddenVoidReturnArgument: 'Observable returned in function argument where a void return was expected.',
      forbiddenVoidReturnAttribute: 'Observable-returning function provided to attribute where a void return was expected.',
      forbiddenVoidReturnInheritedMethod: 'Observable-returning method provided where a void return was expected by extended/implemented type \'{{heritageTypeName}}\'.',
      forbiddenVoidReturnProperty: 'Observable-returning function provided to property where a void return was expected.',
      forbiddenVoidReturnReturnValue: 'Observable-returning function provided to return value where a void return was expected.',
      forbiddenVoidReturnVariable: 'Observable-returning function provided to variable where a void return was expected.',
      forbiddenSpread: 'Expected a non-Observable value to be spread into an object.',
    },
    schema: [
      {
        properties: {
          checksVoidReturn: { type: 'boolean', default: true, description: 'Disallow returning an Observable from a function typed as returning `void`.' },
          checksSpreads: { type: 'boolean', default: true, description: 'Disallow `...` spreading an Observable.' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
  },
  name: 'no-misused-observables',
  create: (context) => {
    const { program, esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(context);
    const checker = program.getTypeChecker();
    const { couldBeObservable, couldReturnObservable } = getTypeServices(context);
    const [config = {}] = context.options;
    const { checksVoidReturn = true, checksSpreads = true } = config;

    const voidReturnChecks: eslint.RuleListener = {
      CallExpression: checkArguments,
      NewExpression: checkArguments,
      JSXAttribute: checkJSXAttribute,
      ClassDeclaration: checkClassLikeOrInterfaceNode,
      ClassExpression: checkClassLikeOrInterfaceNode,
      TSInterfaceDeclaration: checkClassLikeOrInterfaceNode,
      // Property: checkProperty,
      // ReturnStatement: checkReturnStatement,
      // AssignmentExpression: checkAssignment,
      // VariableDeclarator: checkVariableDeclarator,
    };

    const spreadChecks: eslint.RuleListener = {
      SpreadElement: (node) => {
        if (couldBeObservable(node.argument)) {
          context.report({
            messageId: 'forbiddenSpread',
            node: node.argument,
          });
        }
      },
    };

    function checkArguments(node: es.CallExpression | es.NewExpression): void {
      const tsNode = esTreeNodeToTSNodeMap.get(node);
      const voidArgs = voidFunctionArguments(checker, tsNode);
      if (!voidArgs.size) {
        return;
      }

      for (const [index, argument] of node.arguments.entries()) {
        if (!voidArgs.has(index)) {
          continue;
        }

        if (couldReturnObservable(argument)) {
          context.report({
            messageId: 'forbiddenVoidReturnArgument',
            node: argument,
          });
        }
      }
    }

    function checkJSXAttribute(node: es.JSXAttribute): void {
      if (!node.value || !isJSXExpressionContainer(node.value)) {
        return;
      }

      if (couldReturnObservable(node.value.expression)) {
        context.report({
          messageId: 'forbiddenVoidReturnAttribute',
          node: node.value,
        });
      }
    }

    function checkClassLikeOrInterfaceNode(
      node: es.ClassDeclaration | es.ClassExpression | es.TSInterfaceDeclaration,
    ): void {
      const tsNode = esTreeNodeToTSNodeMap.get(node);

      const heritageTypes = getHeritageTypes(checker, tsNode);
      if (!heritageTypes?.length) {
        return;
      }

      for (const element of node.body.body) {
        const tsElement = esTreeNodeToTSNodeMap.get(element);
        const memberName = tsElement?.name?.getText();
        if (memberName === undefined) {
          // See comment in typescript-eslint no-misused-promises for why.
          continue;
        }

        if (!couldReturnObservable(element)) {
          continue;
        }

        if (isStaticMember(element)) {
          continue;
        }

        for (const heritageType of heritageTypes) {
          const heritageMember = getMemberIfExists(heritageType, memberName);
          if (heritageMember === undefined) {
            continue;
          }
          const memberType = checker.getTypeOfSymbolAtLocation(heritageMember, tsElement);
          if (!isVoidReturningFunctionType(memberType)) {
            continue;
          }

          context.report({
            messageId: 'forbiddenVoidReturnInheritedMethod',
            node: element,
            data: { heritageTypeName: checker.typeToString(heritageType) },
          });
        }
      }
    }

    return {
      ...(checksVoidReturn ? voidReturnChecks : {}),
      ...(checksSpreads ? spreadChecks : {}),
    };
  },
});

function voidFunctionArguments(
  checker: ts.TypeChecker,
  tsNode: ts.CallExpression | ts.NewExpression,
): Set<number> {
  // let b = new Object;
  if (!tsNode.arguments) {
    return new Set<number>();
  }

  const voidReturnIndices = new Set<number>();
  const type = checker.getTypeAtLocation(tsNode.expression);

  for (const subType of tsutils.unionTypeParts(type)) {
    const signatures = ts.isCallExpression(tsNode)
      ? subType.getCallSignatures()
      : subType.getConstructSignatures();
    for (const signature of signatures) {
      for (const [index, parameter] of signature.parameters.entries()) {
        const type = checker.getTypeOfSymbolAtLocation(parameter, tsNode.expression);
        if (isVoidReturningFunctionType(type)) {
          voidReturnIndices.add(index);
        }
      }
    }
  }

  return voidReturnIndices;
}

function isVoidReturningFunctionType(
  type: ts.Type,
): boolean {
  let hasVoidReturn = false;

  for (const subType of tsutils.unionTypeParts(type)) {
    for (const signature of subType.getCallSignatures()) {
      const returnType = signature.getReturnType();

      hasVoidReturn ||= tsutils.isTypeFlagSet(returnType, ts.TypeFlags.Void);
    }
  }

  return hasVoidReturn;
}

function getHeritageTypes(
  checker: ts.TypeChecker,
  tsNode: ts.ClassDeclaration | ts.ClassExpression | ts.InterfaceDeclaration,
): ts.Type[] | undefined {
  return tsNode.heritageClauses
    ?.flatMap(clause => clause.types)
    .map(typeExpressions => checker.getTypeAtLocation(typeExpressions));
}

function getMemberIfExists(
  type: ts.Type,
  memberName: string,
): ts.Symbol | undefined {
  const escapedMemberName = ts.escapeLeadingUnderscores(memberName);
  const symbolMemberMatch = type.getSymbol()?.members?.get(escapedMemberName);
  return symbolMemberMatch ?? tsutils.getPropertyOfType(type, escapedMemberName);
}

function isStaticMember(node: es.Node): boolean {
  return (isMethodDefinition(node) || isPropertyDefinition(node))
    && node.static;
}
