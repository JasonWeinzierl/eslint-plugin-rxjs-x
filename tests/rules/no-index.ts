import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../src/rules/no-index");
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("no-index", rule, {
  valid: [
    stripIndent`
      // no index double quote
      import { Observable } from "rxjs";
      import { map } from "rxjs/operators";
      import { TestScheduler } from "rxjs/testing";
      import { WebSocketSubject } from "rxjs/webSocket";
    `,
    stripIndent`
      // no index single quote
      import { Observable } from 'rxjs';
      import { map } from 'rxjs/operators';
      import { TestScheduler } from 'rxjs/testing';
      import { WebSocketSubject } from 'rxjs/webSocket';
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // index double quote
        import { Observable } from "rxjs/index";
                                   ~~~~~~~~~~~~ [forbidden]
        import { map } from "rxjs/operators/index";
                            ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { TestScheduler } from "rxjs/testing/index";
                                      ~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { WebSocketSubject } from "rxjs/webSocket/index";
                                         ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
    fromFixture(
      stripIndent`
        // index single quote
        import { Observable } from 'rxjs/index';
                                   ~~~~~~~~~~~~ [forbidden]
        import { map } from 'rxjs/operators/index';
                            ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { TestScheduler } from 'rxjs/testing/index';
                                      ~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { WebSocketSubject } from 'rxjs/webSocket/index';
                                         ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `
    ),
  ],
});
