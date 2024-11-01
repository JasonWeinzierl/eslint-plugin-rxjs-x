import { TSESTree } from "@typescript-eslint/experimental-utils";
import { getParent } from "./get-parent";

type Predicate = (type: string) => 'break' | 'continue' | 'return';

export function findParent(node: TSESTree.Node, ...types: string[]): TSESTree.Node | undefined;
export function findParent(node: TSESTree.Node, predicate: Predicate): TSESTree.Node | undefined;
export function findParent(node: TSESTree.Node, ...args: (string | Predicate)[]): TSESTree.Node | undefined {
  const [arg] = args;
  const predicate: Predicate =
    typeof arg === 'function'
      ? arg
      : (type: string) => (args.indexOf(type) === -1 ? 'continue' : 'return');
  let parent = getParent(node);
  while (parent) {
    switch (predicate(parent.type)) {
      case 'break':
        return undefined;
      case 'return':
        return parent;
      default:
        break;
    }
    parent = getParent(parent);
  }
  return undefined;
}
