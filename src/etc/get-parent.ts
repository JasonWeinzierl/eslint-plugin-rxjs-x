import { TSESTree as es } from "@typescript-eslint/experimental-utils";

/**
 * @deprecated Use `node.parent` instead.
 */
export function getParent(node: es.Node): es.Node | undefined {
  return node.parent;
}
