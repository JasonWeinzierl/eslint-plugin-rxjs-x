import { TSESTree as es, ESLintUtils } from '@typescript-eslint/utils';
import {
  findParent,
  getLoc,
  getTypeServices,
  isCallExpression,
  isTSAsExpression,
  isTSSatisfiesExpression,
  isVariableDeclarator,
} from '../etc';
import { escapeRegExp, ruleCreator } from '../utils';

type Options = readonly [{
  parameters?: boolean;
  properties?: boolean;
  objects?: boolean;
  suffix?: string;
  types?: Record<string, boolean>;
  variables?: boolean;
}];

const baseShouldHaveSuffix = 'Subject identifiers must end with "{{suffix}}".';

export const suffixSubjectsRule = ruleCreator({
  meta: {
    docs: {
      description: 'Enforce the use of a suffix in subject identifiers.',
      requiresTypeChecking: true,
    },
    messages: {
      forbidden: baseShouldHaveSuffix,
      forbiddenProperty: `${baseShouldHaveSuffix} Add a type annotation, assertion, or 'satisfies' to silence this rule.`,
    },
    schema: [
      {
        properties: {
          parameters: { type: 'boolean', description: 'Require for parameters.' },
          properties: { type: 'boolean', description: 'Require for properties, except object literal keys (see "objects" option).' },
          objects: { type: 'boolean', description: 'Require for object literal keys.' },
          suffix: { type: 'string', description: 'The suffix to enforce.' },
          types: { type: 'object', description: 'Enforce for specific types. Keys are a RegExp, values are a boolean.' },
          variables: { type: 'boolean', description: 'Require for variables.' },
        },
        type: 'object',
      },
    ],
    type: 'problem',
    defaultOptions: [{
      parameters: true,
      properties: true,
      objects: true,
      suffix: 'Subject',
      types: {
        '^EventEmitter$': false,
      },
      variables: true,
    }] as Options,
  },
  name: 'suffix-subjects',
  create: (context) => {
    const { esTreeNodeToTSNodeMap } = ESLintUtils.getParserServices(context);
    const { couldBeType } = getTypeServices(context);
    const [config] = context.options;

    const types: { regExp: RegExp; validate: boolean }[] = [];
    if (config.types) {
      Object.entries(config.types).forEach(
        ([key, validate]: [string, boolean]) => {
          types.push({ regExp: new RegExp(key), validate });
        },
      );
    }

    const { suffix = 'Subject' } = config;
    const suffixRegex = new RegExp(
      String.raw`${escapeRegExp(suffix)}\$?$`,
      'i',
    );

    function checkNode(
      nameNode: es.Node,
      typeNode?: es.Node,
      shouldMessage: 'forbidden' | 'forbiddenProperty' = 'forbidden',
    ) {
      const tsNode = esTreeNodeToTSNodeMap.get(nameNode);
      const text = tsNode.getText();
      if (
        !suffixRegex.test(text)
        && couldBeType(typeNode ?? nameNode, 'Subject')
      ) {
        for (const type of types) {
          const { regExp, validate } = type;
          if (couldBeType(typeNode ?? nameNode, regExp) && !validate) {
            return;
          }
        }
        context.report({
          data: { suffix },
          loc: getLoc(tsNode),
          messageId: shouldMessage,
        });
      }
    }

    return {
      'ArrayPattern > Identifier': (node: es.Identifier) => {
        const found = findParent(
          node,
          'ArrowFunctionExpression',
          'FunctionDeclaration',
          'FunctionExpression',
          'VariableDeclarator',
        );
        if (!found) {
          return;
        }
        if (!config.variables && isVariableDeclarator(found)) {
          return;
        }
        if (!config.parameters) {
          return;
        }
        checkNode(node);
      },
      'ArrowFunctionExpression > Identifier': (node: es.Identifier) => {
        if (config.parameters) {
          const parent = node.parent as es.ArrowFunctionExpression;
          if (node !== parent.body) {
            checkNode(node);
          }
        }
      },
      'PropertyDefinition[computed=false]': (node: es.PropertyDefinition) => {
        const anyNode = node;
        if (config.properties) {
          if (node.override) {
            return;
          }
          checkNode(anyNode.key);
        }
      },
      'FunctionDeclaration > Identifier': (node: es.Identifier) => {
        if (config.parameters) {
          const parent = node.parent as es.FunctionDeclaration;
          if (node !== parent.id) {
            checkNode(node);
          }
        }
      },
      'FunctionExpression > Identifier': (node: es.Identifier) => {
        if (config.parameters) {
          const parent = node.parent as es.FunctionExpression;
          if (node !== parent.id) {
            checkNode(node);
          }
        }
      },
      'MethodDefinition[kind=\'get\'][computed=false]': (
        node: es.MethodDefinition,
      ) => {
        if (config.properties) {
          if (node.override) {
            return;
          }
          checkNode(node.key, node);
        }
      },
      'MethodDefinition[kind=\'set\'][computed=false]': (
        node: es.MethodDefinition,
      ) => {
        if (config.properties) {
          if (node.override) {
            return;
          }
          checkNode(node.key, node);
        }
      },
      'TSAbstractMethodDefinition[computed=false]': (
        node: es.TSAbstractMethodDefinition,
      ) => {
        if (node.override) {
          return;
        }

        if (config.properties && (node.kind === 'get' || node.kind === 'set')) {
          checkNode(node.key, node);
        }

        if (config.parameters) {
          node.value.params.forEach((param: es.Parameter) => {
            checkNode(param);
          });
        }
      },
      'ObjectExpression > Property[computed=false] > Identifier': (
        node: es.Identifier,
      ) => {
        if (!config.objects) {
          return;
        }

        const parent = node.parent as es.Property;
        if (node !== parent.key) {
          return;
        }

        const found = findParent(
          node,
          'CallExpression',
          'VariableDeclarator',
          'TSSatisfiesExpression',
          'TSAsExpression',
        );
        if (found) {
          if (isCallExpression(found)) {
            return;
          } else if (isVariableDeclarator(found) && !!found.id.typeAnnotation) {
            return;
          } else if (isTSAsExpression(found) || isTSSatisfiesExpression(found)) {
            return;
          }
        }

        checkNode(node, undefined, 'forbiddenProperty');
      },
      'ObjectPattern > Property > Identifier': (node: es.Identifier) => {
        const found = findParent(
          node,
          'ArrowFunctionExpression',
          'FunctionDeclaration',
          'FunctionExpression',
          'VariableDeclarator',
        );
        if (!found) {
          return;
        }
        if (!config.variables && isVariableDeclarator(found)) {
          return;
        }
        if (!config.parameters) {
          return;
        }
        const parent = node.parent as es.Property;
        if (node === parent.value) {
          checkNode(node);
        }
      },
      'TSCallSignatureDeclaration > Identifier': (node: es.Node) => {
        if (config.parameters) {
          checkNode(node);
        }
      },
      'TSConstructSignatureDeclaration > Identifier': (node: es.Node) => {
        if (config.parameters) {
          checkNode(node);
        }
      },
      'TSMethodSignature > Identifier': (node: es.Node) => {
        if (config.parameters) {
          checkNode(node);
        }
      },
      'TSParameterProperty > Identifier': (node: es.Identifier) => {
        if (config.parameters || config.properties) {
          checkNode(node);
        }
      },
      'TSPropertySignature[computed=false]': (node: es.TSPropertySignature) => {
        if (config.properties) {
          checkNode(node.key);
        }
      },
      'VariableDeclarator > Identifier': (node: es.Identifier) => {
        const parent = node.parent as es.VariableDeclarator;
        if (config.variables && node === parent.id) {
          checkNode(node);
        }
      },
    };
  },
});
