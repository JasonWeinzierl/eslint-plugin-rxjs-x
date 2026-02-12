import { stripIndent } from 'common-tags';
import { noTapRule } from '../../src/rules/no-tap';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-tap', noTapRule, {
  valid: [
    {
      name: 'no tap',
      code: stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        const ob = of(1).pipe(
          map(x => x * 2)
        );
      `,
    },
    {
      name: 'no tap with shallow import',
      code: stripIndent`
        import { map, of } from "rxjs";
        const ob = of(1).pipe(
          map(x => x * 2)
        );
      `,
    },
  ],
  invalid: [
    fromFixture(
      'tap',
      stripIndent`
        import { of } from "rxjs";
        import { map, tap } from "rxjs/operators";
                      ~~~ [forbidden]
        const ob = of(1).pipe(
          map(x => x * 2),
          tap(value => console.log(value))
        );
      `,
    ),
    fromFixture(
      'tap with shallow import',
      stripIndent`
        import { map, of, tap } from "rxjs";
                          ~~~ [forbidden]
        const ob = of(1).pipe(
          map(x => x * 2),
          tap(value => console.log(value))
        );
      `,
    ),
    fromFixture(
      'tap alias',
      stripIndent`
        import { of } from "rxjs";
        import { map, tap as tapAlias } from "rxjs/operators";
                      ~~~ [forbidden]
        const ob = of(1).pipe(
          map(x => x * 2),
          tapAlias(value => console.log(value))
        );
      `,
    ),
  ],
});
