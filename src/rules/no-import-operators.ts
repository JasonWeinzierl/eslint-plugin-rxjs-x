import { TSESTree as es, TSESLint } from '@typescript-eslint/utils';
import { isIdentifier, isImportSpecifier, isLiteral } from '../etc';
import { ruleCreator } from '../utils';

// See https://rxjs.dev/guide/importing#how-to-migrate

const RENAMED_OPERATORS: Record<string, string> = {
  combineLatest: 'combineLatestWith',
  concat: 'concatWith',
  merge: 'mergeWith',
  onErrorResumeNext: 'onErrorResumeNextWith',
  race: 'raceWith',
  zip: 'zipWith',
};

const DEPRECATED_OPERATORS = [
  'partition',
];

export const noImportOperatorsRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow importing operators from `rxjs/operators`.',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      forbidden: 'RxJS imports from `rxjs/operators` are forbidden.',
      suggest: 'Import from `rxjs` instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-import-operators',
  create: (context) => {
    function getQuote(raw: string): string | undefined {
      const match = /^\s*('|")/.exec(raw);
      if (!match) {
        return undefined;
      }
      const [, quote] = match;
      return quote;
    }

    function getSourceReplacement(rawLocation: string): string | undefined {
      const quote = getQuote(rawLocation);
      if (!quote) {
        return undefined;
      }
      if (/^['"]rxjs\/operators/.test(rawLocation)) {
        return `${quote}rxjs${quote}`;
      }
      return undefined;
    }

    function getName(node: es.Identifier | es.StringLiteral): string {
      return isIdentifier(node) ? node.name : node.value;
    }

    function getSpecifierReplacement(name: string): string | undefined {
      return RENAMED_OPERATORS[name];
    }

    function reportNode(source: es.Literal, importSpecifiers?: es.ImportSpecifier[], exportSpecifiers?: es.ExportSpecifier[]): void {
      const replacement = getSourceReplacement(source.raw);
      if (
        replacement
        && !importSpecifiers?.some(s => DEPRECATED_OPERATORS.includes(getName(s.imported)))
        && !exportSpecifiers?.some(s => DEPRECATED_OPERATORS.includes(getName(s.exported)))
      ) {
        if (importSpecifiers) {
          function* fix(fixer: TSESLint.RuleFixer) {
            // Rename the module name.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            yield fixer.replaceText(source, replacement!);

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (const specifier of importSpecifiers!) {
              const operatorName = getName(specifier.imported);
              const specifierReplacement = getSpecifierReplacement(operatorName);
              if (specifierReplacement) {
                if (specifier.local.name === operatorName) {
                  // concat -> concatWith as concat
                  yield fixer.insertTextBefore(specifier.imported, specifierReplacement + ' as ');
                } else if (isIdentifier(specifier.imported)) {
                  // concat as c -> concatWith as c
                  yield fixer.replaceText(specifier.imported, specifierReplacement);
                } else {
                  // 'concat' as c -> 'concatWith' as c
                  const quote = getQuote(specifier.imported.raw);
                  if (!quote) {
                    continue;
                  }
                  yield fixer.replaceText(specifier.imported, quote + specifierReplacement + quote);
                }
              }
            }
          }
          context.report({
            fix,
            messageId: 'forbidden',
            node: source,
            suggest: [{ messageId: 'suggest', fix }],
          });
        } else if (exportSpecifiers) {
          function* fix(fixer: TSESLint.RuleFixer) {
            // Rename the module name.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            yield fixer.replaceText(source, replacement!);

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (const specifier of exportSpecifiers!) {
              const operatorName = getName(specifier.local);
              const specifierReplacement = getSpecifierReplacement(operatorName);
              if (specifierReplacement) {
                const exportedName = getName(specifier.exported);
                if (exportedName === operatorName) {
                  // concat -> concatWith as concat
                  yield fixer.insertTextBefore(specifier.exported, specifierReplacement + ' as ');
                } else if (isIdentifier(specifier.local)) {
                  // concat as c -> concatWith as c
                  yield fixer.replaceText(specifier.local, specifierReplacement);
                } else {
                  // 'concat' as c -> 'concatWith' as c
                  const quote = getQuote(specifier.local.raw);
                  if (!quote) {
                    continue;
                  }
                  yield fixer.replaceText(specifier.local, quote + specifierReplacement + quote);
                }
              }
            }
          }
          context.report({
            fix,
            messageId: 'forbidden',
            node: source,
            suggest: [{ messageId: 'suggest', fix }],
          });
        } else {
          context.report({
            messageId: 'forbidden',
            node: source,
            suggest: [{ messageId: 'suggest', fix: (fixer) => fixer.replaceText(source, replacement) }],
          });
        }
      } else {
        context.report({
          messageId: 'forbidden',
          node: source,
        });
      }
    }

    return {
      'ImportDeclaration[source.value="rxjs/operators"]': (node: es.ImportDeclaration) => {
        // Exclude side effect imports, default imports, and namespace imports.
        const specifiers = node.specifiers.length && node.specifiers.every(s => isImportSpecifier(s))
          ? node.specifiers
          : undefined;
        reportNode(node.source, specifiers);
      },
      'ImportExpression[source.value="rxjs/operators"]': (node: es.ImportExpression) => {
        if (isLiteral(node.source)) {
          reportNode(node.source);
        }
      },
      'ExportNamedDeclaration[source.value="rxjs/operators"]': (node: es.ExportNamedDeclarationWithSource) => {
        reportNode(node.source, undefined, node.specifiers);
      },
      'ExportAllDeclaration[source.value="rxjs/operators"]': (node: es.ExportAllDeclaration) => {
        reportNode(node.source);
      },
    };
  },
});
