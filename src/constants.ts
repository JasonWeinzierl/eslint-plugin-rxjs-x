export const defaultObservable = String.raw`[Aa]ction(s|s\$|\$)$`;

/**
 * The names of static observable creators
 * that accept a sources object as input.
 */
export const SOURCES_OBJECT_ACCEPTING_STATIC_OBSERVABLE_CREATORS = [
  'combineLatest',
  'forkJoin',
];

/**
 * The names of types that are allowed to be passed unbound.
 */
export const DEFAULT_UNBOUND_ALLOWED_TYPES = [
  'Signal',
];

/**
 * The names of operators that are safe to be used after
 * operators like `takeUntil` that complete the observable.
 */
export const DEFAULT_VALID_POST_COMPLETION_OPERATORS = [
  'count',
  'defaultIfEmpty',
  'endWith',
  'every',
  'finalize',
  'finally',
  'isEmpty',
  'last',
  'max',
  'min',
  'publish',
  'publishBehavior',
  'publishLast',
  'publishReplay',
  'reduce',
  'share',
  'shareReplay',
  'skipLast',
  'takeLast',
  'throwIfEmpty',
  'toArray',
];
