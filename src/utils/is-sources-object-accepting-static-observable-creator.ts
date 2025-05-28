import { TSESTree as es } from '@typescript-eslint/utils';
import { SOURCES_OBJECT_ACCEPTING_STATIC_OBSERVABLE_CREATORS } from '../constants';
import { isCallExpression, isIdentifier } from '../etc/is';

/**
 * Returns true if the given expression is a call to a
 * sourcesObject-accepting static observable creator.
 *
 * @example
 * ```ts
 * combineLatest({ a$: of(), b$: of() });
 * ```
 */
export function isSourcesObjectAcceptingStaticObservableCreator(expression: es.Node): boolean {
  return isCallExpression(expression)
    && isIdentifier(expression.callee)
    && SOURCES_OBJECT_ACCEPTING_STATIC_OBSERVABLE_CREATORS.includes(expression.callee.name);
}
