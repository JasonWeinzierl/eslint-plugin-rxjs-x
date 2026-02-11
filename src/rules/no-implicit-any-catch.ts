import {
  AST_NODE_TYPES,
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import {
  getTypeServices,
  hasTypeAnnotation,
  isArrowFunctionExpression,
  isFunctionExpression,
  isIdentifier,
  isMemberExpression,
  isObjectExpression,
  isProperty,
} from '../etc';
import { ruleCreator } from '../utils';

function isParenthesised(
  sourceCode: Readonly<eslint.SourceCode>,
  node: es.Node,
) {
  const before = sourceCode.getTokenBefore(node);
  const after = sourceCode.getTokenAfter(node);
  return (
    before
    && after
    && before.value === '('
    && before.range[1] <= node.range[0]
    && after.value === ')'
    && after.range[0] >= node.range[1]
  );
}

const defaultOptions: readonly {
  allowExplicitAny?: boolean;
  allowExplicitError?: boolean;
}[] = [];

export const noImplicitAnyCatchRule = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description:
        'Disallow implicit `any` error parameters in `catchError`, `subscribe`, and `tap`.',
      recommended: {
        recommended: true,
        strict: [{
          allowExplicitAny: false,
        }],
      },
      requiresTypeChecking: true,
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      explicitAny: 'Explicit `any` in error callback.',
      implicitAny: 'Implicit `any` in error callback.',
      narrowed: 'Error type must be `unknown` or `any`.',
      narrowedAllowError: 'Error type must be `unknown`, `any`, or `Error`.',
      suggestExplicitUnknown:
        'Use `unknown` instead to explicitly and safely assert the type is correct.',
      suggestExplicitAny:
        'Use `any` instead to explicitly opt out of type safety.',
      suggestExplicitError:
        'Use `Error` instead.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: {
          allowExplicitAny: {
            type: 'boolean',
            description: 'Allow error variable to be explicitly typed as `any`.',
            default: true,
          },
          allowExplicitError: {
            type: 'boolean',
            description: 'Allow narrowing error type to `Error`.',
            default: false,
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
  name: 'no-implicit-any-catch',
  create: (context) => {
    const [config = {}] = context.options;
    const { allowExplicitAny = true, allowExplicitError = false } = config;
    const { couldBeObservable } = getTypeServices(context);
    const sourceCode = context.sourceCode;

    function createReplacerFix(
      typeAnnotation: es.TSTypeAnnotation,
      replaceWith: string,
    ) {
      return function fix(fixer: eslint.RuleFixer) {
        return fixer.replaceText(typeAnnotation, `: ${replaceWith}`);
      };
    }

    function createInserterFix(
      param: es.Parameter,
      annotateWith: string,
      { hasRestParams = false } = {},
    ) {
      return function fix(fixer: eslint.RuleFixer) {
        if (hasRestParams || isParenthesised(sourceCode, param)) {
          return fixer.insertTextAfter(param, `: ${annotateWith}`);
        }
        return [
          fixer.insertTextBefore(param, '('),
          fixer.insertTextAfter(param, `: ${annotateWith})`),
        ];
      };
    }

    function checkCallback(callback: es.Node) {
      if (
        isArrowFunctionExpression(callback)
        || isFunctionExpression(callback)
      ) {
        const [param, ...restParams] = callback.params;
        if (!param) {
          return;
        }
        if (hasTypeAnnotation(param)) {
          const { typeAnnotation } = param;
          const {
            typeAnnotation: { type },
          } = typeAnnotation;

          if (type === AST_NODE_TYPES.TSAnyKeyword) {
            if (allowExplicitAny) {
              return;
            }
            context.report({
              messageId: 'explicitAny',
              node: param,
              suggest: [
                {
                  messageId: 'suggestExplicitUnknown',
                  fix: createReplacerFix(typeAnnotation, 'unknown'),
                },
              ],
            });
          } else if (type !== AST_NODE_TYPES.TSUnknownKeyword) {
            // Check if this is Error type and if it's allowed.
            let isAllowedError = false;
            if (
              allowExplicitError
              && type === AST_NODE_TYPES.TSTypeReference
            ) {
              const typeRef = typeAnnotation.typeAnnotation as es.TSTypeReference;
              if (isIdentifier(typeRef.typeName)) {
                isAllowedError = typeRef.typeName.name === 'Error';
              }
            }

            if (!isAllowedError) {
              context.report({
                messageId: allowExplicitError ? 'narrowedAllowError' : 'narrowed',
                node: param,
                suggest: [
                  {
                    messageId: 'suggestExplicitUnknown' as const,
                    fix: createReplacerFix(typeAnnotation, 'unknown'),
                  },
                  allowExplicitAny ? {
                    messageId: 'suggestExplicitAny' as const,
                    fix: createReplacerFix(typeAnnotation, 'any'),
                  } : null,
                  allowExplicitError && !isAllowedError ? {
                    messageId: 'suggestExplicitError' as const,
                    fix: createReplacerFix(typeAnnotation, 'Error'),
                  } : null,
                ].filter(x => !!x),
              });
            }
          }
        } else {
          const hasRestParams = restParams.length > 0;

          context.report({
            fix: allowExplicitAny ? createInserterFix(param, 'any', { hasRestParams }) : undefined,
            messageId: 'implicitAny',
            node: param,
            suggest: [
              {
                messageId: 'suggestExplicitUnknown' as const,
                fix: createInserterFix(param, 'unknown', { hasRestParams }),
              },
              allowExplicitAny ? {
                messageId: 'suggestExplicitAny' as const,
                fix: createInserterFix(param, 'any', { hasRestParams }),
              } : null,
            ].filter(x => !!x),
          });
        }
      }
    }

    return {
      'CallExpression[callee.name=\'catchError\']': (node: es.CallExpression) => {
        const [callback] = node.arguments;
        if (!callback) {
          return;
        }
        checkCallback(callback);
      },
      'CallExpression[callee.property.name=\'subscribe\'],CallExpression[callee.name=\'tap\']':
        (node: es.CallExpression) => {
          const { callee } = node;
          if (isMemberExpression(callee) && !couldBeObservable(callee.object)) {
            return;
          }
          const [observer, callback] = node.arguments;
          if (callback) {
            checkCallback(callback);
          } else if (observer && isObjectExpression(observer)) {
            const errorProperty = observer.properties.find(
              (property) =>
                isProperty(property)
                && isIdentifier(property.key)
                && property.key.name === 'error',
            ) as es.Property;
            if (errorProperty) {
              checkCallback(errorProperty.value);
            }
          }
        },
    };
  },
});
