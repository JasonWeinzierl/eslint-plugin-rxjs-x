import { stripIndent } from "common-tags";
import rule = require("../../src/rules/no-topromise");
import { fromFixture } from "../etc";
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-topromise", rule, {
  valid: [
    stripIndent`
      // no toPromise
      import { of, Subject } from "rxjs";
      const a = of("a");
      a.subscribe(value => console.log(value));
    `,
    stripIndent`
      // non-observable toPromise
      const a = {
        toPromise() {
          return Promise.resolve("a");
        }
      };
      a.toPromise().then(value => console.log(value));
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // observable toPromise
        import { of } from "rxjs";
        const a = of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // subject toPromise
        import { Subject } from "rxjs";
        const a = new Subject<string>();
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
