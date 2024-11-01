import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent, getTypeServices } from "../etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: "Forbids ignoring the subscription returned by `subscribe`.",
      recommended: false,
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Ignoring returned subscriptions is forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-ignored-subscription",
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    return {
      "ExpressionStatement > CallExpression > MemberExpression[property.name='subscribe']":
        (node: es.MemberExpression) => {
          if (couldBeObservable(node.object)) {
            const callExpression = getParent(node) as es.CallExpression;
            if (
              callExpression.arguments.length === 1 &&
              couldBeType(callExpression.arguments[0], "Subscriber")
            ) {
              return;
            }
            context.report({
              messageId: "forbidden",
              node: node.property,
            });
          }
        },
    };
  },
});

export = rule;
