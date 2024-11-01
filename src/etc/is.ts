import { TSESTree } from "@typescript-eslint/experimental-utils";

export function hasTypeAnnotation<T extends TSESTree.Node>(
  node: T
): node is T & { typeAnnotation: TSESTree.TSTypeAnnotation } {
  return 'typeAnnotation' in node && !!node.typeAnnotation;
}

export function isArrayExpression(node: TSESTree.Node): node is TSESTree.ArrayExpression {
  return node.type === "ArrayExpression";
}

export function isArrayPattern(node: TSESTree.Node): node is TSESTree.ArrayPattern {
  return node.type === "ArrayPattern";
}

export function isArrowFunctionExpression(
  node: TSESTree.Node
): node is TSESTree.ArrowFunctionExpression {
  return node.type === "ArrowFunctionExpression";
}

export function isAssignmentExpression(
  node: TSESTree.Node
): node is TSESTree.AssignmentExpression {
  return node.type === "AssignmentExpression";
}

export function isBlockStatement(node: TSESTree.Node): node is TSESTree.BlockStatement {
  return node.type === "BlockStatement";
}

export function isCallExpression(node: TSESTree.Node): node is TSESTree.CallExpression {
  return node.type === "CallExpression";
}

export function isExportNamedDeclaration(
  node: TSESTree.Node
): node is TSESTree.ExportNamedDeclaration {
  return node.type === "ExportNamedDeclaration";
}

export function isExpressionStatement(
  node: TSESTree.Node
): node is TSESTree.ExpressionStatement {
  return node && node.type === "ExpressionStatement";
}

export function isFunctionDeclaration(
  node: TSESTree.Node
): node is TSESTree.FunctionDeclaration {
  return node.type === "FunctionDeclaration";
}

export function isFunctionExpression(
  node: TSESTree.Node
): node is TSESTree.FunctionExpression {
  return node.type === "FunctionExpression";
}

export function isIdentifier(node: TSESTree.Node): node is TSESTree.Identifier {
  return node.type === "Identifier";
}

export function isLiteral(node: TSESTree.Node): node is TSESTree.Literal {
  return node.type === "Literal";
}

export function isMemberExpression(node: TSESTree.Node): node is TSESTree.MemberExpression {
  return node.type === "MemberExpression";
}

export function isNewExpression(node: TSESTree.Node): node is TSESTree.NewExpression {
  return node.type === "NewExpression";
}

export function isObjectExpression(node: TSESTree.Node): node is TSESTree.ObjectExpression {
  return node.type === "ObjectExpression";
}

export function isObjectPattern(node: TSESTree.Node): node is TSESTree.ObjectPattern {
  return node.type === "ObjectPattern";
}

export function isProgram(node: TSESTree.Node): node is TSESTree.Program {
  return node.type === "Program";
}

export function isProperty(node: TSESTree.Node): node is TSESTree.Property {
  return node.type === "Property";
}

export function isPrivateIdentifier(
  node: TSESTree.Node
): node is TSESTree.PrivateIdentifier {
  return node.type === "PrivateIdentifier";
}

export function isRestElement(node: TSESTree.Node): node is TSESTree.RestElement {
  return node.type === "RestElement";
}

export function isThisExpression(node: TSESTree.Node): node is TSESTree.ThisExpression {
  return node.type === "ThisExpression";
}

export function isTSTypeLiteral(node: TSESTree.Node): node is TSESTree.TSTypeLiteral {
  return node.type === "TSTypeLiteral";
}

export function isTSTypeReference(node: TSESTree.Node): node is TSESTree.TSTypeReference {
  return node.type === "TSTypeReference";
}

export function isVariableDeclarator(
  node: TSESTree.Node
): node is TSESTree.VariableDeclarator {
  return node.type === "VariableDeclarator";
}
