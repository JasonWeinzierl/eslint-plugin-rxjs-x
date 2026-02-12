import { stripIndent } from 'common-tags';
import { preferRootOperatorsRule } from '../../src/rules/prefer-root-operators';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('prefer-root-operators', preferRootOperatorsRule, {
  valid: [
    {
      name: 'import declaration named',
      code: stripIndent`
        import { concatWith } from "rxjs";
        import { mergeWith } from 'rxjs';
      `,
    },
    {
      name: 'import declaration namespace',
      code: stripIndent`
        import * as Rx from "rxjs";
      `,
    },
    {
      name: 'import expression',
      code: stripIndent`
        const { concatWith } = await import("rxjs");
      `,
    },
    {
      name: 'import expression without a string literal is not supported',
      code: stripIndent`
        const path = "rxjs/operators";
        const { concat } = await import(path);
      `,
    },
    {
      name: 'export named',
      code: stripIndent`
        export { concatWith, mergeWith as m } from "rxjs";
      `,
    },
    {
      name: 'export all',
      code: stripIndent`
        export * from "rxjs";
      `,
    },
    {
      name: 'unrelated import',
      code: stripIndent`
        import { ajax } from "rxjs/ajax";
        import { fromFetch } from "rxjs/fetch";
        import { TestScheduler } from "rxjs/testing";
        import { webSocket } from "rxjs/webSocket";
        import * as prefixedPackage from "rxjs-prefixed-package";
      `,
    },
  ],
  invalid: [
    fromFixture(
      'import declaration named',
      stripIndent`
        import { map as m, filter, 'tap' as tap } from "rxjs/operators";
                                                       ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { map as m, filter, 'tap' as tap } from "rxjs";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { map as m, filter, 'tap' as tap } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'import declaration named, renamed operators',
      stripIndent`
        import { 'merge' as m, race as race } from 'rxjs/operators';
                                                   ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { 'mergeWith' as m, raceWith as race } from 'rxjs';
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { 'mergeWith' as m, raceWith as race } from 'rxjs';
            `,
          },
        ],
      },
    ),
    fromFixture(
      'import declaration named, deprecated operator',
      stripIndent`
        import { partition } from "rxjs/operators";
                                  ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix]
      `,
    ),
    fromFixture(
      'import declaration namespace',
      stripIndent`
        import * as RxOperators from "rxjs/operators";
                                     ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import * as RxOperators from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'import declaration default',
      stripIndent`
        import RxOperators, { map } from "rxjs/operators";
                                         ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import RxOperators, { map } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'import expression',
      stripIndent`
        const { concat, merge: m, map } = await import("rxjs/operators");
                                                       ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              const { concat, merge: m, map } = await import("rxjs");
            `,
          },
        ],
      },
    ),
    fromFixture(
      'import expression, separated import',
      stripIndent`
        const opPromise = import("rxjs/operators");
                                 ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix suggest]
        const { concat } = await opPromise;
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              const opPromise = import("rxjs");
              const { concat } = await opPromise;
            `,
          },
        ],
      },
    ),
    fromFixture(
      'import expression, deprecated operator',
      stripIndent`
        const { concat, partition } = await import("rxjs/operators");
                                                   ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              const { concat, partition } = await import("rxjs");
            `,
          },
        ],
      },
    ),
    fromFixture(
      'export named',
      stripIndent`
        export { concat, merge as m, map, 'race' as "r" } from "rxjs/operators";
                                                               ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          export { concatWith as concat, mergeWith as m, map, 'raceWith' as "r" } from "rxjs";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              export { concatWith as concat, mergeWith as m, map, 'raceWith' as "r" } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'export named, deprecated operator',
      stripIndent`
        export { concat, partition } from "rxjs/operators";
                                          ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix]
      `,
    ),
    fromFixture(
      'export all',
      stripIndent`
        export * from "rxjs/operators";
                      ~~~~~~~~~~~~~~~~ [forbiddenWithoutFix suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              export * from "rxjs";
            `,
          },
        ],
      },
    ),
  ],
});
