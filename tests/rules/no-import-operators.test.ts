import { stripIndent } from 'common-tags';
import { noImportOperatorsRule } from '../../src/rules/no-import-operators';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-import-operators', noImportOperatorsRule, {
  valid: [
    stripIndent`
      // import declaration named
      import { concat } from "rxjs";
      import { concat } from 'rxjs';
    `,
    stripIndent`
      // import declaration namespace
      import * as Rx from "rxjs";
    `,
    stripIndent`
      // import expression
      const { concat } = await import("rxjs");
    `,
    stripIndent`
      // import expression with identifier is not supported
      const path = "rxjs/operators";
      const { concat } = await import(path);
    `,
    stripIndent`
      // export named
      export { concat } from "rxjs";
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
        import { concat } from "rxjs/operators";
                               ~~~~~~~~~~~~~~~~ [forbidden]
        import { concat } from 'rxjs/operators';
                               ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // import declaration namespace
        import * as RxOperators from "rxjs/operators";
                                     ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // import expression
        const { concat } = await import("rxjs/operators");
                                        ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // export named
        export { concat } from "rxjs/operators";
                               ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // export all
        export * from "rxjs/operators";
                      ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
