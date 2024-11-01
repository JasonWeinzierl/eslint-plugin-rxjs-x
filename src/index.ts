const { name, version } = require('../package.json');
const recommendedConfig = require('./configs/recommended');

const banObservablesRule = require('./rules/ban-observables');
const banOperatorsRule = require('./rules/ban-operators');
const finnishRule = require('./rules/finnish');
const justRule = require('./rules/just');
const macroRule = require('./rules/macro');
const noAsyncSubscribeRule = require('./rules/no-async-subscribe');
const noCompatRule = require('./rules/no-compat');
const noConnectableRule = require('./rules/no-connectable');
const noCreateRule = require('./rules/no-create');
const noCyclicActionRule = require('./rules/no-cyclic-action');
const noExplicitGenericsRule = require('./rules/no-explicit-generics');
const noExposedSubjectsRule = require('./rules/no-exposed-subjects');
const noFinnishRule = require('./rules/no-finnish');
const noIgnoredErrorRule = require('./rules/no-ignored-error');
const noIgnoredNotifierRule = require('./rules/no-ignored-notifier');
const noIgnoredObservableRule = require('./rules/no-ignored-observable');
const noIgnoredReplayBufferRule = require('./rules/no-ignored-replay-buffer');
const noIgnoredSubscribeRule = require('./rules/no-ignored-subscribe');
const noIgnoredSubscriptionRule = require('./rules/no-ignored-subscription');
const noIgnoredTakewhileValueRule = require('./rules/no-ignored-takewhile-value');
const noImplicitAnyCatchRule = require('./rules/no-implicit-any-catch');
const noIndexRule = require('./rules/no-index');
const noInternalRule = require('./rules/no-internal');
const noNestedSubscribeRule = require('./rules/no-nested-subscribe');
const noRedundantNotifyRule = require('./rules/no-redundant-notify');
const noSharereplayRule = require('./rules/no-sharereplay');
const noSubclassRule = require('./rules/no-subclass');
const noSubjectUnsubscribeRule = require('./rules/no-subject-unsubscribe');
const noSubjectValueRule = require('./rules/no-subject-value');
const noSubscribeHandlersRule = require('./rules/no-subscribe-handlers');
const noTapRule = require('./rules/no-tap');
const noTopromiseRule = require('./rules/no-topromise');
const noUnboundMethodsRule = require('./rules/no-unbound-methods');
const noUnsafeCatchRule = require('./rules/no-unsafe-catch');
const noUnsafeFirstRule = require('./rules/no-unsafe-first');
const noUnsafeSubjectNext = require('./rules/no-unsafe-subject-next');
const noUnsafeSwitchmapRule = require('./rules/no-unsafe-switchmap');
const noUnsafeTakeuntilRule = require('./rules/no-unsafe-takeuntil');
const preferObserverRule = require('./rules/prefer-observer');
const suffixSubjectsRule = require('./rules/suffix-subjects');
const throwErrorRule = require('./rules/throw-error');

module.exports = {
  meta: { name, version },
  configs: {
    recommended: recommendedConfig,
  },
  rules: {
    'ban-observables': banObservablesRule,
    'ban-operators': banOperatorsRule,
    'finnish': finnishRule,
    'just': justRule,
    'macro': macroRule,
    'no-async-subscribe': noAsyncSubscribeRule,
    'no-compat': noCompatRule,
    'no-connectable': noConnectableRule,
    'no-create': noCreateRule,
    'no-cyclic-action': noCyclicActionRule,
    'no-explicit-generics': noExplicitGenericsRule,
    'no-exposed-subjects': noExposedSubjectsRule,
    'no-finnish': noFinnishRule,
    'no-ignored-error': noIgnoredErrorRule,
    'no-ignored-notifier': noIgnoredNotifierRule,
    'no-ignored-observable': noIgnoredObservableRule,
    'no-ignored-replay-buffer': noIgnoredReplayBufferRule,
    'no-ignored-subscribe': noIgnoredSubscribeRule,
    'no-ignored-subscription': noIgnoredSubscriptionRule,
    'no-ignored-takewhile-value': noIgnoredTakewhileValueRule,
    'no-implicit-any-catch': noImplicitAnyCatchRule,
    'no-index': noIndexRule,
    'no-internal': noInternalRule,
    'no-nested-subscribe': noNestedSubscribeRule,
    'no-redundant-notify': noRedundantNotifyRule,
    'no-sharereplay': noSharereplayRule,
    'no-subclass': noSubclassRule,
    'no-subject-unsubscribe': noSubjectUnsubscribeRule,
    'no-subject-value': noSubjectValueRule,
    'no-subscribe-handlers': noSubscribeHandlersRule,
    'no-tap': noTapRule,
    'no-topromise': noTopromiseRule,
    'no-unbound-methods': noUnboundMethodsRule,
    'no-unsafe-catch': noUnsafeCatchRule,
    'no-unsafe-first': noUnsafeFirstRule,
    'no-unsafe-subject-next': noUnsafeSubjectNext,
    'no-unsafe-switchmap': noUnsafeSwitchmapRule,
    'no-unsafe-takeuntil': noUnsafeTakeuntilRule,
    'prefer-observer': preferObserverRule,
    'suffix-subjects': suffixSubjectsRule,
    'throw-error': throwErrorRule,
  },
};
