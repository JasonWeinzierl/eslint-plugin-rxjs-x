import { stripIndent } from 'common-tags';
import { noSubclassRule } from '../../src/rules/no-subclass';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subclass', noSubclassRule, {
  valid: [
    {
      name: 'non-RxJS Observable',
      code: stripIndent`
        class Observable<T> { t: T; }
        class StringObservable extends Observable<string> {}
      `,
    },
  ],
  invalid: [
    fromFixture(
      'Observable',
      stripIndent`
        import { Observable } from "rxjs";
        class GenericObservable<T> extends Observable<T> {}
                                           ~~~~~~~~~~ [forbidden]
        class StringObservable extends Observable<string> {}
                                       ~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'Subject',
      stripIndent`
        import { Subject } from "rxjs";
        class GenericSubject<T> extends Subject<T> {}
                                        ~~~~~~~ [forbidden]
        class StringSubject extends Subject<string> {}
                                    ~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'Subscriber',
      stripIndent`
        import { Subscriber } from "rxjs";
        class GenericSubscriber<T> extends Subscriber<T> {}
                                           ~~~~~~~~~~ [forbidden]
        class StringSubscriber extends Subscriber<string> {}
                                       ~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'AsyncSubject',
      stripIndent`
        import { AsyncSubject } from "rxjs";
        class GenericAsyncSubject<T> extends AsyncSubject<T> {}
                                             ~~~~~~~~~~~~ [forbidden]
        class StringAsyncSubject extends AsyncSubject<string> {}
                                         ~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'BehaviorSubject',
      stripIndent`
        import { BehaviorSubject } from "rxjs";
        class GenericBehaviorSubject<T> extends BehaviorSubject<T> {}
                                                ~~~~~~~~~~~~~~~ [forbidden]
        class StringBehaviorSubject extends BehaviorSubject<string> {}
                                            ~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'ReplaySubject',
      stripIndent`
        import { ReplaySubject } from "rxjs";
        class GenericReplaySubject<T> extends ReplaySubject<T> {}
                                              ~~~~~~~~~~~~~ [forbidden]
        class StringReplaySubject extends ReplaySubject<string> {}
                                          ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'Scheduler',
      stripIndent`
        import { Scheduler } from "rxjs/internal/Scheduler";
        class AnotherScheduler extends Scheduler {}
                                       ~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
