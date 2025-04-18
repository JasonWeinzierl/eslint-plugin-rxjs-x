export const defaultObservable = String.raw`[Aa]ction(s|s\$|\$)$`;

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
