import { stripIndent } from 'common-tags';
import { noRedundantNotifyRule } from '../../src/rules/no-redundant-notify';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-redundant-notify', noRedundantNotifyRule, {
  valid: [
    {
      name: 'observable next + complete',
      code: stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.next(42);
          observer.complete();
        })
      `,
    },
    {
      name: 'observable next + error',
      code: stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.next(42);
          observer.error(new Error("Kaboom!"));
        })
      `,
    },
    {
      name: 'observable next + unsubscribe',
      code: stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.next(42);
          observer.unsubscribe();
        })
      `,
    },
    {
      name: 'subject next + complete',
      code: stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.next(42);
        subject.complete();
      `,
    },
    {
      name: 'subject next + error',
      code: stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.next(42);
        subject.error(new Error("Kaboom!"));
      `,
    },
    {
      name: 'subject next + unsubscribe',
      code: stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.next(42);
        subject.unsubscribe();
      `,
    },
    {
      name: 'different names with error',
      code: stripIndent`
        import { Subject } from "rxjs";
        const a = new Subject<number>();
        const b = new Subject<number>();
        a.error(new Error("Kaboom!"));
        b.error(new Error("Kaboom!"));
      `,
    },
    {
      name: 'different names with complete',
      code: stripIndent`
        import { Subject } from "rxjs";
        const a = new Subject<number>();
        const b = new Subject<number>();
        a.complete();
        b.complete();
      `,
    },
    {
      name: 'different names with unsubscribe',
      code: stripIndent`
        import { Subject } from "rxjs";
        const a = new Subject<number>();
        const b = new Subject<number>();
        a.unsubscribe();
        b.unsubscribe();
      `,
    },
    {
      name: 'non-observer',
      code: stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        console.error(new Error("Kaboom!"));
      `,
    },
    {
      name: 'multiple subjects',
      code: stripIndent`
        import { Subject } from "rxjs";
        class SomeClass {
          private a = new Subject<number>();
          private b = new Subject<number>();
          someMethod() {
            this.a.complete();
            this.b.next();
            this.b.complete();
          }
        }
      `,
    },
  ],
  invalid: [
    fromFixture(
      'observable complete + next',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable complete + complete',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable complete + error',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable error + next',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable error + complete',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable error + error',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      'observable unsubscribe + next',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable unsubscribe + complete',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable unsubscribe + error',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      'observable unsubscribe + unsubscribe',
      stripIndent`
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.unsubscribe();
                   ~~~~~~~~~~~ [forbidden]
        })
      `,
    ),

    fromFixture(
      'subject complete + next',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.next(42);
                ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject complete + complete',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.complete();
                ~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject complete + error',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject error + next',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.next(42);
                ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject error + complete',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.complete();
                ~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject error + error',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject unsubscribe + next',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.next(42);
                ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject unsubscribe + complete',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.complete();
                ~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject unsubscribe + error',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject unsubscribe + unsubscribe',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.unsubscribe();
                ~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
