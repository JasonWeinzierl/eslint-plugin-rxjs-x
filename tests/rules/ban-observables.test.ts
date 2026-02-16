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
      name: 'banned but not used',
      code: `import { of, Observable } from "rxjs";`,
      options: [{ Subject: true }],
    },
    {
      name: 'not banned',
      code: stripIndent`
        import { of } from "rxjs";
        of(1);
      `,
      options: [{ of: false }],
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
      'banned literal',
      stripIndent`
        import { 'of' as o } from "rxjs";
                 ~~~~ [forbidden { "name": "of", "explanation": "" }]
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
