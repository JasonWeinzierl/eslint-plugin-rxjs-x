import * as tsvfs from '@typescript/vfs';
import * as ts from 'typescript';

interface SourceFileAndTypeChecker {
  sourceFile: ts.SourceFile;
  typeChecker: ts.TypeChecker;
}

export function createSourceFileAndTypeChecker(
  sourceText: string,
  fileName = 'file.tsx',
): SourceFileAndTypeChecker {
  const compilerOptions: ts.CompilerOptions = {
    lib: ['ES2018'],
    target: ts.ScriptTarget.ES2018,
    module: ts.ModuleKind.CommonJS,
  };

  const fsMap = tsvfs.createDefaultMapFromNodeModules(compilerOptions, ts);
  fsMap.set(fileName, sourceText);
  fsMap.set('a.ts', 'export class A {}');
  fsMap.set('b.ts', 'export class B {}');

  const system = tsvfs.createSystem(fsMap);
  const env = tsvfs.createVirtualTypeScriptEnvironment(
    system,
    [fileName, 'a.ts', 'b.ts'],
    ts,
    compilerOptions,
  );

  const program = env.languageService.getProgram();
  if (program === undefined) {
    throw new Error('Failed to get program');
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    sourceFile: program.getSourceFile(fileName)!,
    typeChecker: program.getTypeChecker(),
  };
}
