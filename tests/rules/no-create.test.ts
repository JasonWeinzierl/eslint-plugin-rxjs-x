import { stripIndent } from 'common-tags';
import { noCreateRule } from '../../src/rules/no-create';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-create', noCreateRule, {
  valid: [
    stripIndent`
      // new Observable
      import { Observable, Observer } from "rxjs";

      const ob = new Observable((observer: Observer<string>) => {
        observer.next("Hello, world.");
        observer.complete();
        return () => {};
      });
    `,
    stripIndent`
      // Subject
      import { Subject, of } from "rxjs";

      const sub = new Subject();
    `,
    stripIndent`
      // unrelated create
      const Subject = {
        create() { }
      }
      
      Subject.create();
    `,
  ],
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
      `,
    ),
    fromFixture(
      stripIndent`
        // Subject.create
        import { Subject, of } from "rxjs";

        const sub = Subject.create(new Subject(), of(1, 2, 3));
                            ~~~~~~ [forbiddenSubject]
      `,
    ),
    fromFixture(
      stripIndent`
        // BehaviorSubject.create
        import { BehaviorSubject, Subject, of } from "rxjs";

        const sub = BehaviorSubject.create(new Subject(), of(1, 2, 3));
                                    ~~~~~~ [forbiddenSubject]
      `,
    ),
    fromFixture(
      stripIndent`
        // AsyncSubject.create
        import { AsyncSubject, Subject, of } from "rxjs";

        const sub = AsyncSubject.create(new Subject(), of(1, 2, 3));
                                 ~~~~~~ [forbiddenSubject]
      `,
    ),
    fromFixture(
      stripIndent`
        // ReplaySubject.create
        import { ReplaySubject, Subject, of } from "rxjs";

        const sub = ReplaySubject.create(new Subject(), of(1, 2, 3));
                                  ~~~~~~ [forbiddenSubject]
      `,
    ),
  ],
});
