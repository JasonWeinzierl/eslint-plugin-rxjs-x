import type { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';

type Predicate = (type: AST_NODE_TYPES) => 'break' | 'continue' | 'return';

type ParentMatch<TTypes extends readonly AST_NODE_TYPES[]> = Extract<TSESTree.Node, { type: TTypes[number] }>;

export function findParent<const TTypes extends readonly AST_NODE_TYPES[]>(
  node: TSESTree.Node,
  ...types: TTypes
): ParentMatch<TTypes> | undefined;
export function findParent(node: TSESTree.Node, ...types: string[]): TSESTree.Node | undefined;
export function findParent(node: TSESTree.Node, predicate: Predicate): TSESTree.Node | undefined;
export function findParent(node: TSESTree.Node, ...args: (string | Predicate)[]): TSESTree.Node | undefined {
  const [arg] = args;
  const predicate: Predicate
    = typeof arg === 'function'
      ? arg
      : (type: string) => (!args.includes(type) ? 'continue' : 'return');
  let parent = node.parent as TSESTree.Node | undefined;
  while (parent) {
    switch (predicate(parent.type)) {
      case 'break':
        return undefined;
      case 'return':
        return parent;
      default:
        break;
    }
    parent = parent.parent;
  }
  return undefined;
}
