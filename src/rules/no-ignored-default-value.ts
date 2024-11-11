import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import { getTypeServices, isIdentifier, isImport, isMemberExpression, isObjectExpression, isProperty } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredDefaultValueRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow using `firstValueFrom`, `lastValueFrom`, `first`, and `last` without specifying a default value.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Not specifying a default value is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-default-value',
  create: (context) => {
    const { getTypeAtLocation } = ESLintUtils.getParserServices(context);
    const { couldBeObservable } = getTypeServices(context);

    function checkConfigObj(configArg: es.ObjectExpression) {
      if (!configArg.properties.some(p => isProperty(p) && isIdentifier(p.key) && p.key.name === 'defaultValue')) {
        context.report({
          messageId: 'forbidden',
          node: configArg,
        });
      }
    }

    function checkConfigType(configArg: es.Node) {
      const configArgType = getTypeAtLocation(configArg);
      if (!configArgType?.getProperties().some(p => p.name === 'defaultValue')) {
        context.report({
          messageId: 'forbidden',
          node: configArg,
        });
      }
    }

    function checkFunctionArgs(callExpression: es.CallExpression, reportNode: es.Node) {
      const scope = context.sourceCode.getScope(callExpression);
      if (!isImport(scope, 'firstValueFrom', /^rxjs\/?/)
        && !isImport(scope, 'lastValueFrom', /^rxjs\/?/)) {
        return;
      }
      const { arguments: args } = callExpression;
      if (!args || args.length <= 0) {
        return;
      }
      const [observableArg, configArg] = args;
      if (!couldBeObservable(observableArg)) {
        return;
      }
      if (!configArg) {
        context.report({
          messageId: 'forbidden',
          node: reportNode,
        });
        return;
      }
      if (isIdentifier(configArg)) {
        checkConfigType(configArg);
        return;
      } else if (isMemberExpression(configArg) && isIdentifier(configArg.property)) {
        checkConfigType(configArg.property);
        return;
      }
      if (!isObjectExpression(configArg)) {
        return;
      }
      checkConfigObj(configArg);
    }

    function checkOperatorArgs(callExpression: es.CallExpression, reportNode: es.Node) {
      const scope = context.sourceCode.getScope(callExpression);
      if (!isImport(scope, 'first', /^rxjs\/?/)
        && !isImport(scope, 'last', /^rxjs\/?/)) {
        return;
      }
      const { arguments: args } = callExpression;

      if (!args || args.length <= 0) {
        context.report({
          messageId: 'forbidden',
          node: reportNode,
        });
        return;
      }
      const [arg] = args;
      if (isIdentifier(arg)) {
        checkConfigType(arg);
        return;
      } else if (isMemberExpression(arg) && isIdentifier(arg.property)) {
        checkConfigType(arg.property);
        return;
      }
      if (!isObjectExpression(arg)) {
        return;
      }
      checkConfigObj(arg);
    }

    return {
      'CallExpression[callee.name=/^(firstValueFrom|lastValueFrom)$/]': (
        node: es.CallExpression,
      ) => {
        checkFunctionArgs(node, node.callee);
      },
      'CallExpression[callee.property.name=\'pipe\'] > CallExpression[callee.name=/^(first|last)$/]': (
        node: es.CallExpression,
      ) => {
        checkOperatorArgs(node, node.callee);
      },
    };
  },
});
