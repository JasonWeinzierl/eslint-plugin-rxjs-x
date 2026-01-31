import { TSESTree as es, TSESLint as eslint, ESLintUtils } from '@typescript-eslint/utils';
import * as tsutils from 'ts-api-utils';
import { couldBeFunction } from './could-be-function';
import { couldBeType as tsutilsEtcCouldBeType } from './could-be-type';
import { isArrowFunctionExpression, isFunctionDeclaration } from './is';

export function getTypeServices<
  TMessageIds extends string,
  TOptions extends readonly unknown[],
>(context: eslint.RuleContext<TMessageIds, Readonly<TOptions>>) {
  const services = ESLintUtils.getParserServices(context);
  const { program, getTypeAtLocation } = services;
  const typeChecker = program.getTypeChecker();

  const couldBeType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    const type = getTypeAtLocation(node);
    return tsutilsEtcCouldBeType(
      type,
      name,
      qualified ? { ...qualified, typeChecker } : undefined,
    );
  };

  const couldReturnType = (
    node: es.Node,
    name: string | RegExp,
    qualified?: { name: RegExp },
  ): boolean => {
    const type = getTypeAtLocation(node);

    for (const signature of tsutils.getCallSignaturesOfType(type)) {
      const returnType = signature.getReturnType();
      if (tsutilsEtcCouldBeType(
        returnType,
        name,
        qualified ? { ...qualified, typeChecker } : undefined,
      )) {
        return true;
      }
    }
    return false;
  };

  return {
    couldBeBehaviorSubject: (node: es.Node) =>
      couldBeType(node, 'BehaviorSubject'),
    couldBeFunction: (node: es.Node) => {
      if (isArrowFunctionExpression(node) || isFunctionDeclaration(node)) {
        return true;
      }
      return couldBeFunction(getTypeAtLocation(node));
    },
    couldBeMonoTypeOperatorFunction: (node: es.Node) =>
      couldBeType(node, 'MonoTypeOperatorFunction'),
    couldBeObservable: (node: es.Node) => couldBeType(node, 'Observable'),
    couldBeSubject: (node: es.Node) => couldBeType(node, 'Subject'),
    couldBeSubscription: (node: es.Node) => couldBeType(node, 'Subscription'),
    couldBeType,
    couldReturnObservable: (node: es.Node) =>
      couldReturnType(node, 'Observable'),
    couldReturnType,
  };
}
