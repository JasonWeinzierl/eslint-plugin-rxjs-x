import { stripIndent } from "common-tags";
import rule = require("../../src/rules/ban-observables");
import { fromFixture } from "../etc";
import { ruleTester } from "../utils";

ruleTester({ types: false }).run("ban-observables", rule, {
  valid: [
    {
      code: `import { of, Observable } from "rxjs";`,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        import { of, Observable as o, Subject } from "rxjs";
                 ~~ [forbidden { "name": "of", "explanation": "" }]
                     ~~~~~~~~~~ [forbidden { "name": "Observable", "explanation": ": because I say so" }]
      `,
      {
        options: [
          {
            of: true,
            Observable: "because I say so",
            Subject: false,
          },
        ],
      }
    ),
  ],
});
