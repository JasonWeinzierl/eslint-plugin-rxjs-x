import { AST_NODE_TYPES, TSESTree as es } from '@typescript-eslint/utils';
import { describe, expect, it } from 'vitest';
import { findParent } from '../../src/etc/find-parent';

function makeNode(type: AST_NODE_TYPES, parent?: es.Node): es.Node {
  return {
    parent,
    type,
  } as es.Node;
}

describe('findParent', () => {
  it('should find the first matching parent by type', () => {
    const program = makeNode(AST_NODE_TYPES.Program);
    const functionDeclaration = makeNode(AST_NODE_TYPES.FunctionDeclaration, program);
    const blockStatement = makeNode(AST_NODE_TYPES.BlockStatement, functionDeclaration);
    const identifier = makeNode(AST_NODE_TYPES.Identifier, blockStatement);

    expect(findParent(identifier, AST_NODE_TYPES.FunctionDeclaration)).toBe(functionDeclaration);
    expect(findParent(identifier, AST_NODE_TYPES.Program)).toBe(program);
    expect(findParent(identifier, AST_NODE_TYPES.ClassDeclaration)).toBeUndefined();
  });

  it('should match against multiple types', () => {
    const program = makeNode(AST_NODE_TYPES.Program);
    const ifStatement = makeNode(AST_NODE_TYPES.IfStatement, program);
    const blockStatement = makeNode(AST_NODE_TYPES.BlockStatement, ifStatement);
    const identifier = makeNode(AST_NODE_TYPES.Identifier, blockStatement);

    expect(findParent(identifier, AST_NODE_TYPES.Program, AST_NODE_TYPES.IfStatement)).toBe(ifStatement);
  });

  it('should search by predicate', () => {
    const program = makeNode(AST_NODE_TYPES.Program);
    const functionDeclaration = makeNode(AST_NODE_TYPES.FunctionDeclaration, program);
    const blockStatement = makeNode(AST_NODE_TYPES.BlockStatement, functionDeclaration);
    const identifier = makeNode(AST_NODE_TYPES.Identifier, blockStatement);

    expect(
      findParent(identifier, (type) => (type === AST_NODE_TYPES.Program ? 'break' : 'continue')),
    ).toBeUndefined();
    expect(
      findParent(identifier, (type) => (type === AST_NODE_TYPES.FunctionDeclaration ? 'return' : 'continue')),
    ).toBe(functionDeclaration);
  });

  describe('TypeScript type narrowing', () => {
    it('should narrow the result when called with literal AST node types', () => {
      const identifier = makeNode(AST_NODE_TYPES.Identifier);
      const narrowed = findParent(identifier, AST_NODE_TYPES.Program, AST_NODE_TYPES.IfStatement);

      const validAssignment: es.Program | es.IfStatement | undefined = narrowed;
      expect(validAssignment).toBeUndefined();

      // @ts-expect-error -- The narrowed result should not include ClassDeclaration.
      const invalidAssignment: es.ClassDeclaration | undefined = narrowed;
      expect(invalidAssignment).toBeUndefined();
    });

    it('should not narrow when called with strings or a predicate', () => {
      const identifier = makeNode(AST_NODE_TYPES.Identifier);

      const type: string = AST_NODE_TYPES.Program;
      const fromString = findParent(identifier, type);
      const fromStringLiteral = findParent(identifier, 'Program');
      const fromPredicate = findParent(
        identifier,
        (): 'break' | 'continue' | 'return' => 'continue',
      );

      const validStringAssignment: es.Node | undefined = fromString;
      const validStringLiteralAssignment: es.Node | undefined = fromStringLiteral;
      const validPredicateAssignment: es.Node | undefined = fromPredicate;
      expect(validStringAssignment).toBeUndefined();
      expect(validStringLiteralAssignment).toBeUndefined();
      expect(validPredicateAssignment).toBeUndefined();

      // @ts-expect-error Non-literal string calls should not narrow to Program.
      const invalidStringAssignment: es.Program | undefined = fromString;
      expect(invalidStringAssignment).toBeUndefined();
      // @ts-expect-error Literal string calls should not narrow to Program.
      const invalidStringLiteralAssignment: es.Program | undefined = fromStringLiteral;
      expect(invalidStringLiteralAssignment).toBeUndefined();
      // @ts-expect-error Predicate overload should not narrow to Program.
      const invalidPredicateAssignment: es.Program | undefined = fromPredicate;
      expect(invalidPredicateAssignment).toBeUndefined();
    });
  });
});
