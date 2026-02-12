import { stripIndent } from 'common-tags';
import { noUnsafeSubjectNext } from '../../src/rules/no-unsafe-subject-next';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-unsafe-subject-next', noUnsafeSubjectNext, {
  valid: [
    {
      name: 'number next',
      code: stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next(42);
      `,
    },
    {
      name: 'replay number next',
      code: stripIndent`
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next(42);
      `,
    },
    {
      name: 'any next',
      code: stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject<any>();
        s.next(42);
        s.next();
      `,
    },
    {
      name: 'unknown next',
      code: stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject<unknown>();
        s.next(42);
        s.next();
      `,
    },
    {
      name: 'void next',
      code: stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject<void>();
        s.next();
      `,
    },
    {
      name: 'void union next',
      code: stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject<number | void>();
        s.next(42);
        s.next();
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/76',
      code: stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject();
        s.next();
      `,
    },
  ],
  invalid: [
    fromFixture(
      'optional number next',
      stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject<number>();
        s.next();
          ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'optional replay number next',
      stripIndent`
        import { ReplaySubject } from "rxjs";
        const s = new ReplaySubject<number>();
        s.next();
          ~~~~ [forbidden]
      `,
    ),
  ],
});
