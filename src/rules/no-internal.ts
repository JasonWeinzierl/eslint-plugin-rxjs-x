import {
  TSESTree as es,
  TSESLint as eslint,
} from '@typescript-eslint/utils';
import { isIdentifier, isImportSpecifier } from '../etc';
import { ruleCreator } from '../utils';

const INTERNAL_OPERATORS_PREFIX = 'rxjs/internal/operators/';

// Same-name re-exports from matching internal files in the RxJS 7 operators barrel.
// Leave version-dependent aliases (e.g. onErrorResumeNext) and types report-only.
const PUBLIC_OPERATORS = new Set([
  'audit',
  'auditTime',
  'buffer',
  'bufferCount',
  'bufferTime',
  'bufferToggle',
  'bufferWhen',
  'catchError',
  'combineAll',
  'combineLatest',
  'combineLatestAll',
  'combineLatestWith',
  'concat',
  'concatAll',
  'concatMap',
  'concatMapTo',
  'concatWith',
  'connect',
  'count',
  'debounce',
  'debounceTime',
  'defaultIfEmpty',
  'delay',
  'delayWhen',
  'dematerialize',
  'distinct',
  'distinctUntilChanged',
  'distinctUntilKeyChanged',
  'elementAt',
  'endWith',
  'every',
  'exhaust',
  'exhaustAll',
  'exhaustMap',
  'expand',
  'filter',
  'finalize',
  'find',
  'findIndex',
  'first',
  'flatMap',
  'groupBy',
  'ignoreElements',
  'isEmpty',
  'last',
  'map',
  'mapTo',
  'materialize',
  'max',
  'merge',
  'mergeAll',
  'mergeMap',
  'mergeMapTo',
  'mergeScan',
  'mergeWith',
  'min',
  'multicast',
  'observeOn',
  'pairwise',
  'partition',
  'pluck',
  'publish',
  'publishBehavior',
  'publishLast',
  'publishReplay',
  'race',
  'raceWith',
  'reduce',
  'refCount',
  'repeat',
  'repeatWhen',
  'retry',
  'retryWhen',
  'sample',
  'sampleTime',
  'scan',
  'sequenceEqual',
  'share',
  'shareReplay',
  'single',
  'skip',
  'skipLast',
  'skipUntil',
  'skipWhile',
  'startWith',
  'subscribeOn',
  'switchAll',
  'switchMap',
  'switchMapTo',
  'switchScan',
  'take',
  'takeLast',
  'takeUntil',
  'takeWhile',
  'tap',
  'throttle',
  'throttleTime',
  'throwIfEmpty',
  'timeInterval',
  'timeout',
  'timeoutWith',
  'timestamp',
  'toArray',
  'window',
  'windowCount',
  'windowTime',
  'windowToggle',
  'windowWhen',
  'withLatestFrom',
  'zip',
  'zipAll',
  'zipWith',
]);

function isPublicOperatorImport(node: es.ImportDeclaration): boolean {
  const operator = node.source.value.slice(INTERNAL_OPERATORS_PREFIX.length);
  return node.source.value.startsWith(INTERNAL_OPERATORS_PREFIX)
    && PUBLIC_OPERATORS.has(operator)
    && node.specifiers.length > 0
    && node.specifiers.every((specifier) => {
      if (!isImportSpecifier(specifier)) {
        return false;
      }
      const { imported } = specifier;
      return (isIdentifier(imported) ? imported.name : imported.value) === operator;
    });
}

export const noInternalRule = ruleCreator({
  meta: {
    docs: {
      description: 'Disallow importing internal modules.',
      recommended: 'recommended',
    },
    fixable: 'code',
    hasSuggestions: true,
    messages: {
      forbidden: 'RxJS imports from internal are forbidden.',
      suggest: 'Import from a non-internal location.',
    },
    schema: [],
    type: 'problem',
  },
  name: 'no-internal',
  create: (context) => {
    function getReplacement(node: es.ImportDeclaration) {
      const location = node.source.raw;
      const match = /^\s*('|")/.exec(location);
      if (!match) {
        return;
      }
      const [, quote] = match;
      if (/^['"]rxjs\/internal\/ajax/.test(location)) {
        return `${quote}rxjs/ajax${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable\/dom\/fetch/.test(location)) {
        return `${quote}rxjs/fetch${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable\/dom\/webSocket/i.test(location)) {
        return `${quote}rxjs/webSocket${quote}`;
      }
      if (/^['"]rxjs\/internal\/observable/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (isPublicOperatorImport(node)) {
        return `${quote}rxjs/operators${quote}`;
      }
      if (/^['"]rxjs\/internal\/scheduled/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/scheduler/.test(location)) {
        return `${quote}rxjs${quote}`;
      }
      if (/^['"]rxjs\/internal\/testing/.test(location)) {
        return `${quote}rxjs/testing${quote}`;
      }
      return;
    }

    return {
      [String.raw`ImportDeclaration[source.value=/^rxjs\u002finternal/]`]: (
        declaration: es.ImportDeclaration,
      ) => {
        const node = declaration.source;
        const replacement = getReplacement(declaration);
        if (replacement) {
          function fix(fixer: eslint.RuleFixer) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return fixer.replaceText(node, replacement!);
          }
          context.report({
            fix,
            messageId: 'forbidden',
            node,
            suggest: [{ fix, messageId: 'suggest' }],
          });
        } else {
          context.report({
            messageId: 'forbidden',
            node,
          });
        }
      },
    };
  },
});
