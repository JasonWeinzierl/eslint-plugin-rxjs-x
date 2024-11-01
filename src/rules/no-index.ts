import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description: "Forbids the importation from index modules.",
      recommended: "error",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "RxJS imports from index modules are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-index",
  create: (context) => {
    return {
      [String.raw`ImportDeclaration Literal[value=/^rxjs(?:\u002f\w+)?\u002findex/]`]:
        (node: es.Literal) => {
          context.report({
            messageId: "forbidden",
            node,
          });
        },
    };
  },
});

export = rule;
