/**
 * There is known issue with unbuild CJS bundling: https://github.com/unjs/unbuild/issues/374
 *
 * Script from https://github.com/antfu-collective/vite-plugin-inspect/blob/main/scripts/postbuild.ts
 *
 * Explanation of problem: https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/FalseExportDefault.md
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

function patchCjs(cjsModulePath: string, name: string) {
  const cjsModule = readFileSync(cjsModulePath, 'utf-8')
  writeFileSync(
    cjsModulePath,
    cjsModule
      .replace(`'use strict';`, `'use strict';Object.defineProperty(exports, '__esModule', {value: true});`)
      .replace(`module.exports = ${name};`, `exports.default = ${name};`),
    { encoding: 'utf-8' },
  )
}

patchCjs(resolve('./dist/index.cjs'), 'rxjsX')
