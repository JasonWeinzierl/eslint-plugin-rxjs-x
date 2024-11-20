import { TSESTree as es, TSESLint } from '@typescript-eslint/utils';
import { getTypeServices, isIdentifier, isImportDeclaration, isImportNamespaceSpecifier, isImportSpecifier } from '../etc';
import { ruleCreator } from '../utils';

export const noTopromiseRule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Disallow use of the `toPromise` method.',
      requiresTypeChecking: true,
    },
    hasSuggestions: true,
    messages: {
      forbidden: 'The toPromise method is forbidden.',
      suggestLastValueFrom: 'Use lastValueFrom instead.',
      suggestFirstValueFrom: 'Use firstValueFrom instead.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-topromise',
  create: (context) => {
    const { couldBeObservable } = getTypeServices(context);

    function getQuote(raw: string) {
      const match = /^\s*('|")/.exec(raw);
      if (!match) {
        return undefined;
      }
      const [, quote] = match;
      return quote;
    }

    function createFix(
      conversion: 'lastValueFrom' | 'firstValueFrom',
      callExpression: es.CallExpression,
      observableNode: es.Node,
    ) {
      return function* fix(fixer: TSESLint.RuleFixer) {
        let namespace = '';
        let functionName: string = conversion;

        const { body } = context.sourceCode.ast;
        const importDeclarations = body.filter(isImportDeclaration);

        const rxjsImportDeclaration = importDeclarations.find(node => node.source.value === 'rxjs');

        if (rxjsImportDeclaration?.specifiers?.every(isImportNamespaceSpecifier)) {
          // Existing rxjs namespace import. Use alias.
          namespace = rxjsImportDeclaration.specifiers[0].local.name + '.';
        } else if (rxjsImportDeclaration?.specifiers?.every(isImportSpecifier)) {
          // Existing rxjs named import.
          const { specifiers } = rxjsImportDeclaration;
          const existingSpecifier = specifiers.find(node => (isIdentifier(node.imported) ? node.imported.name : node.imported.value) === functionName);
          if (existingSpecifier) {
            // Function already imported. Use its alias, if any.
            functionName = existingSpecifier.local.name;
          } else {
            // Function not already imported. Add it.
            const lastSpecifier = specifiers[specifiers.length - 1];
            yield fixer.insertTextAfter(lastSpecifier, `, ${functionName}`);
          }
        } else if (importDeclarations.length) {
          // No rxjs import. Add to end of imports, respecting quotes.
          const lastImport = importDeclarations[importDeclarations.length - 1];
          const quote = getQuote(lastImport.source.raw) ?? '"';
          yield fixer.insertTextAfter(
            importDeclarations[importDeclarations.length - 1],
            `\nimport { ${functionName} } from ${quote}rxjs${quote};`,
          );
        } else {
          // No imports. Add to top of file.
          yield fixer.insertTextBefore(
            body[0],
            `import { ${functionName} } from "rxjs";\n`,
          );
        }

        yield fixer.replaceText(
          callExpression,
          `${namespace}${functionName}(${context.sourceCode.getText(observableNode)})`,
        );
      };
    }

    return {
      [`CallExpression[callee.property.name="toPromise"]`]: (
        node: es.CallExpression,
      ) => {
        const memberExpression = node.callee as es.MemberExpression;
        if (!couldBeObservable(memberExpression.object)) {
          return;
        }
        context.report({
          messageId: 'forbidden',
          node: memberExpression.property,
          suggest: [
            {
              messageId: 'suggestLastValueFrom',
              fix: createFix('lastValueFrom', node, memberExpression.object),
            },
            {
              messageId: 'suggestFirstValueFrom',
              fix: createFix('firstValueFrom', node, memberExpression.object),
            },
          ],
        });
      },
    };
  },
});
