import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { couldBeType } from '../../src/etc/could-be-type';
import { createSourceFileAndTypeChecker } from './create-source-file-and-type-checker';

describe('couldBeType', () => {
  it('should match a specific type', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      class A {}
      let a: A;
      `,
    );
    const node = (sourceFile.statements[1] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(true);
  });

  it('should not match different types', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      class A {}
      class B {}
      let b: B;
      `,
    );
    const node = (sourceFile.statements[2] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(false);
    expect(couldBeType(type, 'B')).toBe(true);
  });

  it('should match a base type', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      class A {}
      class B extends A {}
      let b: B;
      `,
    );
    const node = (sourceFile.statements[2] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(true);
    expect(couldBeType(type, 'B')).toBe(true);
  });

  it('should match an implemented interface', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      interface A { name: string; }
      class B implements A { name = ""; }
      let b: B;
      `,
    );
    const node = (sourceFile.statements[2] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(true);
    expect(couldBeType(type, 'B')).toBe(true);
  });

  it('should match an implemented generic interface', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      interface A<T> { value: T; }
      class B<T> implements A<T> { constructor(public value: T) {} }
      let b = new B<string>("B");
      `,
    );
    const node = (sourceFile.statements[2] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(true);
    expect(couldBeType(type, 'B')).toBe(true);
  });

  it('should match an intersection type', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      class A {}
      class B {}
      let ab: A & B;
      `,
    );
    const node = (sourceFile.statements[2] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(true);
    expect(couldBeType(type, 'B')).toBe(true);
  });

  it('should match a type alias intersection of type aliases', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      type A = { id: number };
      type B = { name: string };
      type AB = A & B;
      let ab: AB;
      `,
    );
    const node = (sourceFile.statements[3] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(true);
    expect(couldBeType(type, 'B')).toBe(true);
  });

  it('should not match a type alias that is not preserved', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      type A = { id: number };
      type B = { name: string };
      type C = B; // TypeScript does not preserve this alias.
      type AB = A & B;
      let ab: AB;
      `,
    );
    const node = (sourceFile.statements[4] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'C')).toBe(false);
  });

  it('should match a union type', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      class A {}
      class B {}
      let ab: A | B;
      `,
    );
    const node = (sourceFile.statements[2] as ts.VariableStatement).declarationList.declarations[0];
    const type = typeChecker.getTypeAtLocation(node);

    expect(couldBeType(type, 'A')).toBe(true);
    expect(couldBeType(type, 'B')).toBe(true);
  });

  it('should support fully-qualified types', () => {
    const { sourceFile, typeChecker } = createSourceFileAndTypeChecker(
      `
      import { A } from "/a";
      class B {}
      let a: A;
      let b: B;
      `,
    );
    const nodeA = (sourceFile.statements[2] as ts.VariableStatement).declarationList.declarations[0];
    const nodeB = (sourceFile.statements[3] as ts.VariableStatement).declarationList.declarations[0];
    const typeA = typeChecker.getTypeAtLocation(nodeA);
    const typeB = typeChecker.getTypeAtLocation(nodeB);

    expect(
      couldBeType(typeA, 'A', {
        name: /"\/a"/,
        typeChecker,
      }),
    ).toBe(true);
    expect(
      couldBeType(typeB, 'B', {
        name: /b/,
        typeChecker,
      }),
    ).toBe(false);
  });
});
