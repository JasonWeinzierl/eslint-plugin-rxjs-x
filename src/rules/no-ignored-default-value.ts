import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices, isIdentifier, isImport, isObjectExpression, isProperty } from '../etc';
import { ruleCreator } from '../utils';

export const noIgnoredDefaultValueRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow using `firstValueFrom`, `lastValueFrom`, `first`, and `last` without specifying a default value.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: 'Ignoring the default value is forbidden.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-ignored-default-value',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    function checkConfig(configArg: es.ObjectExpression) {
      if (!configArg.properties.some(p => isProperty(p) && isIdentifier(p.key) && p.key.name === 'defaultValue')) {
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
      if (!isObjectExpression(configArg)) {
        return;
      }
      checkConfig(configArg);
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
      if (!isObjectExpression(arg)) {
        return;
      }
      checkConfig(arg);
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
