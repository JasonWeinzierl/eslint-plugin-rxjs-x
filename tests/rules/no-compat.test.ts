import { stripIndent } from 'common-tags';
import { noCompatRule } from '../../src/rules/no-compat';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-compat', noCompatRule, {
  valid: [
    {
      name: 'root',
      code: `import { Observable } from "rxjs";`,
    },
    {
      name: 'ajax',
      code: `import { ajax } from "rxjs/ajax";`,
    },
    {
      name: 'fetch',
      code: `import { fromFetch } from "rxjs/fetch";`,
    },
    {
      name: 'operators',
      code: `import { concatMap } from "rxjs/operators";`,
    },
    {
      name: 'testing',
      code: `import { TestScheduler } from "rxjs/testing";`,
    },
    {
      name: 'webSocket',
      code: `import { webSocket } from "rxjs/webSocket";`,
    },
    {
      name: 'unrelated',
      code: `import * as prefixedPackage from "rxjs-prefixed-package";`,
    },
  ],
  invalid: [
    fromFixture(
      'Rx',
      stripIndent`
        import * as Rx from "rxjs/Rx";
                            ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'Observable',
      stripIndent`
        import { Observable } from "rxjs/Observable";
                                   ~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'Subject',
      stripIndent`
        import { Subject } from "rxjs/Subject";
                                ~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'observable/merge',
      stripIndent`
        import { merge } from "rxjs/observable/merge";
                              ~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'operator/merge',
      stripIndent`
        import { merge } from "rxjs/operator/merge";
                              ~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'scheduler/asap',
      stripIndent`
        import { asap } from "rxjs/scheduler/asap";
                             ~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'add/observable/merge',
      stripIndent`
        import "rxjs/add/observable/merge";
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'add/operator/mergeMap',
      stripIndent`
        import "rxjs/add/operator/mergeMap";
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
