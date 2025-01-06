import { stripIndent } from 'common-tags';
import { noRedundantNotifyRule } from '../../src/rules/no-redundant-notify';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-redundant-notify', noRedundantNotifyRule, {
  valid: [
    stripIndent`
      // observable next + complete
      import { Observable } from "rxjs";
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.complete();
      })
    `,
    stripIndent`
      // observable next + error
      import { Observable } from "rxjs";
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.error(new Error("Kaboom!"));
      })
    `,
    stripIndent`
      // observable next + unsubscribe
      import { Observable } from "rxjs";
      const observable = new Observable<number>(observer => {
        observer.next(42);
        observer.unsubscribe();
      })
    `,
    stripIndent`
      // subject next + complete
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.next(42);
      subject.complete();
    `,
    stripIndent`
      // subject next + error
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.next(42);
      subject.error(new Error("Kaboom!"));
    `,
    stripIndent`
      // subject next + unsubscribe
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.next(42);
      subject.unsubscribe();
    `,
    stripIndent`
      // different names with error
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.error(new Error("Kaboom!"));
      b.error(new Error("Kaboom!"));
    `,
    stripIndent`
      // different names with complete
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.complete();
      b.complete();
    `,
    stripIndent`
      // different names with unsubscribe
      import { Subject } from "rxjs";
      const a = new Subject<number>();
      const b = new Subject<number>();
      a.unsubscribe();
      b.unsubscribe();
    `,
    stripIndent`
      // non-observer
      import { Subject } from "rxjs";
      const subject = new Subject<number>();
      subject.error(new Error("Kaboom!"));
      console.error(new Error("Kaboom!"));
    `,
    stripIndent`
      // multiple subjects
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
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // observable complete + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable complete + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable complete + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.complete();
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable error + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable error + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable error + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.error(new Error("Kaboom!"));
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      stripIndent`
        // observable unsubscribe + next
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.next(42);
                   ~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable unsubscribe + complete
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.complete();
                   ~~~~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable unsubscribe + error
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.error(new Error("Kaboom!"));
                   ~~~~~ [forbidden]
        })
      `,
    ),
    fromFixture(
      stripIndent`
        // observable unsubscribe + unsubscribe
        import { Observable } from "rxjs";
        const observable = new Observable<number>(observer => {
          observer.unsubscribe();
          observer.unsubscribe();
                   ~~~~~~~~~~~ [forbidden]
        })
      `,
    ),

    fromFixture(
      stripIndent`
        // subject complete + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.next(42);
                ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject complete + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.complete();
                ~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject complete + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.complete();
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject error + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.next(42);
                ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject error + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.complete();
                ~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject error + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.error(new Error("Kaboom!"));
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject unsubscribe + next
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.next(42);
                ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject unsubscribe + complete
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.complete();
                ~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject unsubscribe + error
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.error(new Error("Kaboom!"));
                ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // subject unsubscribe + unsubscribe
        import { Subject } from "rxjs";
        const subject = new Subject<number>();
        subject.unsubscribe();
        subject.unsubscribe();
                ~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
