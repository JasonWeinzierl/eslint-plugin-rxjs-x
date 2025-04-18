import { TSESTree as es } from '@typescript-eslint/utils';
import { isCallExpression, isIdentifier, isMemberExpression } from '../etc';

/**
 * Finds the last operator in an observable composition matching the given regex
 * which is ordered such that only the given {@link allow} operators
 * are present after it.
 */
export function findIsLastOperatorOrderValid(pipeCallExpression: es.CallExpression, operatorsRegExp: RegExp, allow: string[]) {
  let isOrderValid = true;
  let operatorNode: es.Node | undefined;

  for (let i = pipeCallExpression.arguments.length - 1; i >= 0; i--) {
    const arg = pipeCallExpression.arguments[i];

    if (operatorNode) {
      break;
    }

    if (!isCallExpression(arg)) {
      isOrderValid = false;
      continue;
    }

    let operatorName: string;
    if (isIdentifier(arg.callee)) {
      operatorName = arg.callee.name;
    } else if (
      isMemberExpression(arg.callee)
      && isIdentifier(arg.callee.property)
    ) {
      operatorName = arg.callee.property.name;
    } else {
      isOrderValid = false;
      continue;
    }

    if (operatorsRegExp.test(operatorName)) {
      operatorNode = arg.callee;
      break;
    }

    if (!allow.includes(operatorName)) {
      isOrderValid = false;
      continue;
    }
  }

  return { isOrderValid, operatorNode };
}
