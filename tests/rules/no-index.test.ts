import { stripIndent } from 'common-tags';
import { noIndexRule } from '../../src/rules/no-index';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-index', noIndexRule, {
  valid: [
    {
      name: 'no index double quote',
      code: stripIndent`
        import { Observable } from "rxjs";
        import { map } from "rxjs/operators";
        import { TestScheduler } from "rxjs/testing";
        import { WebSocketSubject } from "rxjs/webSocket";
      `,
    },
    {
      name: 'no index single quote',
      code: stripIndent`
        import { Observable } from 'rxjs';
        import { map } from 'rxjs/operators';
        import { TestScheduler } from 'rxjs/testing';
        import { WebSocketSubject } from 'rxjs/webSocket';
      `,
    },
  ],
  invalid: [
    fromFixture(
      'index double quote',
      stripIndent`
        import { Observable } from "rxjs/index";
                                   ~~~~~~~~~~~~ [forbidden]
        import { map } from "rxjs/operators/index";
                            ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { TestScheduler } from "rxjs/testing/index";
                                      ~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { WebSocketSubject } from "rxjs/webSocket/index";
                                         ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'index single quote',
      stripIndent`
        import { Observable } from 'rxjs/index';
                                   ~~~~~~~~~~~~ [forbidden]
        import { map } from 'rxjs/operators/index';
                            ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { TestScheduler } from 'rxjs/testing/index';
                                      ~~~~~~~~~~~~~~~~~~~~ [forbidden]
        import { WebSocketSubject } from 'rxjs/webSocket/index';
                                         ~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
