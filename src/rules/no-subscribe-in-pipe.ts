/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { TSESTree as es } from "@typescript-eslint/experimental-utils";
import { getParent, getTypeServices } from "eslint-etc";
import { ruleCreator } from "../utils";

const rule = ruleCreator({
  defaultOptions: [],
  meta: {
    docs: {
      description:
        "Forbids the calling of `subscribe` within any RxJS operator inside a `pipe`.",
      recommended: "error",
    },
    fixable: undefined,
    hasSuggestions: false,
    messages: {
      forbidden: "Subscribe calls within pipe operators are forbidden.",
    },
    schema: [],
    type: "problem",
  },
  name: "no-subscribe-in-pipe",
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);

    function isWithinPipe(node: es.Node): boolean {
      let parent = getParent(node);
      while (parent) {
        if (
          parent.type === "CallExpression" &&
          parent.callee.type === "MemberExpression" &&
          parent.callee.property.type === "Identifier" &&
          parent.callee.property.name === "pipe"
        ) {
          return true;
        }
        parent = getParent(parent);
      }
      return false;
    }

    return {
      "CallExpression > MemberExpression[property.name='subscribe']": (
        node: es.MemberExpression
      ) => {
        if (
          !couldBeObservable(node.object) &&
          !couldBeType(node.object, "Subscribable")
        ) {
          return;
        }

        if (isWithinPipe(node)) {
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
