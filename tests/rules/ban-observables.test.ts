import { stripIndent } from 'common-tags';
import { banObservablesRule } from '../../src/rules/ban-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('ban-observables', banObservablesRule, {
  valid: [
    {
      name: 'no options',
      code: `import { of, Observable } from "rxjs";`,
    },
    {
      name: 'not banned',
      code: `import { of, Observable } from "rxjs";`,
      options: [{ Subject: true }],
    },
  ],
  invalid: [
    fromFixture(
      'banned',
      stripIndent`
        import { of, Observable as o, Subject } from "rxjs";
                 ~~ [forbidden { "name": "of", "explanation": "" }]
      `,
      {
        options: [{ of: true }],
      },
    ),
    fromFixture(
      'banned with explanation',
      stripIndent`
        import { of, Observable as o, Subject } from "rxjs";
                     ~~~~~~~~~~ [forbidden { "name": "Observable", "explanation": ": because I say so" }]
      `,
      {
        options: [{ Observable: 'because I say so' }],
      },
    ),
  ],
});
