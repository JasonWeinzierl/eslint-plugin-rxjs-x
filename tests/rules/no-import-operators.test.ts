import { stripIndent } from 'common-tags';
import { noImportOperatorsRule } from '../../src/rules/no-import-operators';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-import-operators', noImportOperatorsRule, {
  valid: [
    stripIndent`
      // import declaration named
      import { concatWith } from "rxjs";
      import { mergeWith } from 'rxjs';
    `,
    stripIndent`
      // import declaration namespace
      import * as Rx from "rxjs";
    `,
    stripIndent`
      // import expression
      const { concatWith } = await import("rxjs");
    `,
    stripIndent`
      // import expression without a string literal is not supported
      const path = "rxjs/operators";
      const { concat } = await import(path);
    `,
    stripIndent`
      // export named
      export { concatWith, mergeWith as m } from "rxjs";
    `,
    stripIndent`
      // export all
      export * from "rxjs";
    `,
    stripIndent`
      // unrelated import
      import { ajax } from "rxjs/ajax";
      import { fromFetch } from "rxjs/fetch";
      import { TestScheduler } from "rxjs/testing";
      import { webSocket } from "rxjs/webSocket";
      import * as prefixedPackage from "rxjs-prefixed-package";
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // import declaration named
        import { concat, map } from "rxjs/operators";
                                    ~~~~~~~~~~~~~~~~ [forbidden suggest 0]
        import { 'merge' as m, race as r } from 'rxjs/operators';
                                                ~~~~~~~~~~~~~~~~ [forbidden suggest 1]
      `,
      {
        output: stripIndent`
          // import declaration named
          import { concatWith as concat, map } from "rxjs";
          import { 'mergeWith' as m, raceWith as r } from 'rxjs';
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // import declaration named
              import { concatWith as concat, map } from "rxjs";
              import { 'merge' as m, race as r } from 'rxjs/operators';
            `,
          },
          {
            messageId: 'suggest',
            output: stripIndent`
              // import declaration named
              import { concat, map } from "rxjs/operators";
              import { 'mergeWith' as m, raceWith as r } from 'rxjs';
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // import declaration named, deprecated operator
        import { partition } from "rxjs/operators";
                                  ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // import declaration namespace
        import * as RxOperators from "rxjs/operators";
                                     ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // import declaration namespace
              import * as RxOperators from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // import declaration default
        import RxOperators, { map } from "rxjs/operators";
                                         ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // import declaration default
              import RxOperators, { map } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // import expression
        const { concat, merge: m, map } = await import("rxjs/operators");
                                                       ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // import expression
              const { concat, merge: m, map } = await import("rxjs");
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // import expression, separated import
        const opPromise = import("rxjs/operators");
                                 ~~~~~~~~~~~~~~~~ [forbidden suggest]
        const { concat } = await opPromise;
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // import expression, separated import
              const opPromise = import("rxjs");
              const { concat } = await opPromise;
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // import expression, deprecated operator
        const { concat, partition } = await import("rxjs/operators");
                                                   ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // import expression, deprecated operator
              const { concat, partition } = await import("rxjs");
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // export named
        export { concat, merge as m, map, 'race' as "r" } from "rxjs/operators";
                                                               ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          // export named
          export { concatWith as concat, mergeWith as m, map, 'raceWith' as "r" } from "rxjs";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // export named
              export { concatWith as concat, mergeWith as m, map, 'raceWith' as "r" } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // export named, deprecated operator
        export { concat, partition } from "rxjs/operators";
                                          ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // export all
        export * from "rxjs/operators";
                      ~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              // export all
              export * from "rxjs";
            `,
          },
        ],
      },
    ),
  ],
});
