import { stripIndent } from 'common-tags';
import { noSubjectUnsubscribeRule } from '../../src/rules/no-subject-unsubscribe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subject-unsubscribe', noSubjectUnsubscribeRule, {
  valid: [
    {
      name: 'unsubscribe Subject subscription',
      code: stripIndent`
        import { Subject } from "rxjs";
        const a = new Subject<number>();
        const asub = a.subscribe();
        asub.unsubscribe();
      `,
    },
    {
      name: 'unsubscribe AsyncSubject subscription',
      code: stripIndent`
        import { AsyncSubject } from "rxjs";
        const a = new AsyncSubject<number>();
        const asub = a.subscribe();
        asub.unsubscribe();
      `,
    },
  ],
  invalid: [
    fromFixture(
      'unsubscribe Subject',
      stripIndent`
        import { Subject } from "rxjs";
        const b = new Subject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'unsubscribe AsyncSubject',
      stripIndent`
        import { AsyncSubject } from "rxjs";
        const b = new AsyncSubject<number>();
        b.unsubscribe();
          ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'compose Subject',
      stripIndent`
        import { Subject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new Subject<number>();
        csub.add(c);
                 ~ [forbidden]
      `,
    ),
    fromFixture(
      'compose AsyncSubject',
      stripIndent`
        import { AsyncSubject, Subscription } from "rxjs";
        const csub = new Subscription();
        const c = new AsyncSubject<number>();
        csub.add(c);
                 ~ [forbidden]
      `,
    ),
  ],
});
