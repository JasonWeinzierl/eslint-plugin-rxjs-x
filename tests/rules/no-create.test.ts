import { stripIndent } from 'common-tags';
import { noCreateRule } from '../../src/rules/no-create';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-create', noCreateRule, {
  valid: [
    {
      name: 'new Observable',
      code: stripIndent`
        import { Observable, Observer } from "rxjs";

        const ob = new Observable((observer: Observer<string>) => {
          observer.next("Hello, world.");
          observer.complete();
          return () => {};
        });
      `,
    },
    {
      name: 'Subject',
      code: stripIndent`
        import { Subject, of } from "rxjs";

        const sub = new Subject();
      `,
    },
    {
      name: 'unrelated create',
      code: stripIndent`
        const Subject = {
          create() { }
        }

        Subject.create();
      `,
    },
  ],
  invalid: [
    fromFixture(
      'create',
      stripIndent`
        import { Observable, Observer } from "rxjs";

        const ob = Observable.create((observer: Observer<string>) => {
                              ~~~~~~ [forbidden]
            observer.next("Hello, world.");
            observer.complete();
            return () => {};
        });
      `,
    ),
    fromFixture(
      'Subject.create',
      stripIndent`
        import { Subject, of } from "rxjs";

        const sub = Subject.create(new Subject(), of(1, 2, 3));
                            ~~~~~~ [forbiddenSubject]
      `,
    ),
    fromFixture(
      'BehaviorSubject.create',
      stripIndent`
        import { BehaviorSubject, Subject, of } from "rxjs";

        const sub = BehaviorSubject.create(new Subject(), of(1, 2, 3));
                                    ~~~~~~ [forbiddenSubject]
      `,
    ),
    fromFixture(
      'AsyncSubject.create',
      stripIndent`
        import { AsyncSubject, Subject, of } from "rxjs";

        const sub = AsyncSubject.create(new Subject(), of(1, 2, 3));
                                 ~~~~~~ [forbiddenSubject]
      `,
    ),
    fromFixture(
      'ReplaySubject.create',
      stripIndent`
        import { ReplaySubject, Subject, of } from "rxjs";

        const sub = ReplaySubject.create(new Subject(), of(1, 2, 3));
                                  ~~~~~~ [forbiddenSubject]
      `,
    ),
  ],
});
