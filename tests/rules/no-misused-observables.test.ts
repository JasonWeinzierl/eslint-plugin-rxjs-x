import { stripIndent } from 'common-tags';
import { noMisusedObservablesRule } from '../../src/rules/no-misused-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-misused-observables', noMisusedObservablesRule, {
  valid: [
    {
      code: stripIndent`
        // spread; explicitly allowed
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
      `,
      options: [{ checksSpreads: false }],
    },
    stripIndent`
      // unrelated
      const foo = { bar: 42 };
      const baz = { ...foo };
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // spread variable
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
                         ~~~~~~ [forbiddenSpread]
      `,
    ),
    fromFixture(
      stripIndent`
        // spread call function
        import { of } from "rxjs";

        function source() {
          return of(42);
        }
        const foo = { ...source() };
                         ~~~~~~~~ [forbiddenSpread]
      `,
    ),
  ],
});
