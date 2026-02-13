import { TSESTree } from '@typescript-eslint/utils';

type NodeType = TSESTree.Node['type'];
type ParentMatch<TTypes extends readonly NodeType[]> = Extract<TSESTree.Node, { type: TTypes[number] }>;

type Predicate = (type: string) => 'break' | 'continue' | 'return';

export function findParent<const TTypes extends readonly NodeType[]>(
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
