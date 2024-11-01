import { TSESLint, TSESTree } from "@typescript-eslint/experimental-utils";
import * as tsutils from 'tsutils-etc';
import * as ts from 'typescript';
import { getParserServices } from "./get-parser-services";
import { isArrowFunctionExpression, isFunctionDeclaration } from "./is";

export function getTypeServices<
  TMessageIds extends string,
  TOptions extends readonly unknown[],
>(context: TSESLint.RuleContext<TMessageIds, Readonly<TOptions>>) {
  const services = getParserServices(context);
  const { esTreeNodeToTSNodeMap, program } = services;
  const typeChecker = program.getTypeChecker();

  const couldBeType = (
    node: TSESTree.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    const type = getType(node);
    return tsutils.couldBeType(
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
      && tsutils.couldBeType(
        typeChecker.getTypeAtLocation(tsTypeNode),
        name,
        qualified ? { ...qualified, typeChecker } : undefined,
      ),
    );
  };

  const getType = (node: TSESTree.Node): ts.Type => {
    // TODO: typescript-eslint v6 has a shortcut `getTypeAtLocation` returned from `getParserServices()`.
    const tsNode = esTreeNodeToTSNodeMap.get(node);
    return tsNode && typeChecker.getTypeAtLocation(tsNode);
  };

  return {
    couldBeBehaviorSubject: (node: TSESTree.Node) =>
      couldBeType(node, 'BehaviorSubject'),
    couldBeError: (node: TSESTree.Node) => couldBeType(node, "Error"),
    couldBeFunction: (node: TSESTree.Node) => {
      if (isArrowFunctionExpression(node) || isFunctionDeclaration(node)) {
        return true;
      }
      return tsutils.couldBeFunction(getType(node));
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
    isAny: (node: TSESTree.Node) => tsutils.isAny(getType(node)),
    isReferenceType: (node: TSESTree.Node) => tsutils.isReferenceType(getType(node)),
    isUnknown: (node: TSESTree.Node) => tsutils.isUnknown(getType(node)),
    typeChecker,
  };
}
