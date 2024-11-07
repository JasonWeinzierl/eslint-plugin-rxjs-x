import { ESLintUtils, TSESLint, TSESTree } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import ts from 'typescript';
import { couldBeFunction } from './could-be-function';
import { couldBeType as tsutilsEtcCouldBeType } from './could-be-type';
import { isArrowFunctionExpression, isFunctionDeclaration } from './is';

export function getTypeServices<
  TMessageIds extends string,
  TOptions extends readonly unknown[],
>(context: TSESLint.RuleContext<TMessageIds, Readonly<TOptions>>) {
  const services = ESLintUtils.getParserServices(context);
  const { esTreeNodeToTSNodeMap, program, getTypeAtLocation } = services;
  const typeChecker = program.getTypeChecker();

  const couldBeType = (
    node: TSESTree.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    const type = getType(node);
    return tsutilsEtcCouldBeType(
      type,
      name,
      qualified ? { ...qualified, typeChecker } : undefined,
    );
  };

  const couldReturnType = (
    node: TSESTree.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    let tsTypeNode: ts.Node | undefined;
    const tsNode = esTreeNodeToTSNodeMap.get(node);
    if (
      ts.isArrowFunction(tsNode)
      || ts.isFunctionDeclaration(tsNode)
      || ts.isMethodDeclaration(tsNode)
      || ts.isFunctionExpression(tsNode)
    ) {
      tsTypeNode = tsNode.type ?? tsNode.body;
    } else if (
      ts.isCallSignatureDeclaration(tsNode)
      || ts.isMethodSignature(tsNode)
    ) {
      tsTypeNode = tsNode.type;
    }
    return Boolean(
      tsTypeNode
      && tsutilsEtcCouldBeType(
        typeChecker.getTypeAtLocation(tsTypeNode),
        name,
        qualified ? { ...qualified, typeChecker } : undefined,
      ),
    );
  };

  const getType = (node: TSESTree.Node): ts.Type => {
    return getTypeAtLocation(node);
  };

  return {
    couldBeBehaviorSubject: (node: TSESTree.Node) =>
      couldBeType(node, 'BehaviorSubject'),
    couldBeError: (node: TSESTree.Node) => couldBeType(node, 'Error'),
    couldBeFunction: (node: TSESTree.Node) => {
      if (isArrowFunctionExpression(node) || isFunctionDeclaration(node)) {
        return true;
      }
      return couldBeFunction(getType(node));
    },
    couldBeMonoTypeOperatorFunction: (node: TSESTree.Node) =>
      couldBeType(node, 'MonoTypeOperatorFunction'),
    couldBeObservable: (node: TSESTree.Node) => couldBeType(node, 'Observable'),
    couldBeSubject: (node: TSESTree.Node) => couldBeType(node, 'Subject'),
    couldBeSubscription: (node: TSESTree.Node) => couldBeType(node, 'Subscription'),
    couldBeType,
    couldReturnObservable: (node: TSESTree.Node) =>
      couldReturnType(node, 'Observable'),
    couldReturnType,
    getType,
    isAny: (node: TSESTree.Node) => tsutils.isIntrinsicAnyType(getType(node)),
    isReferenceType: (node: TSESTree.Node) => tsutils.isTypeReference(getType(node)),
    isUnknown: (node: TSESTree.Node) => tsutils.isIntrinsicUnknownType(getType(node)),
    typeChecker,
  };
}
