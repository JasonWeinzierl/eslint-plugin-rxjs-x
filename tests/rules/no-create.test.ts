import { stripIndent } from "common-tags";
import rule = require("../../src/rules/no-create");
import { fromFixture } from "../etc";
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-create", rule, {
  valid: [],
  invalid: [
    fromFixture(
      stripIndent`
        // create
        import { Observable, Observer } from "rxjs";

        const ob = Observable.create((observer: Observer<string>) => {
                              ~~~~~~ [forbidden]
            observer.next("Hello, world.");
            observer.complete();
            return () => {};
        });
      `
    ),
  ],
});
