import { createRuleTester } from "eslint-etc";
import { resolve } from "path";

export const ruleTester = createRuleTester({
  filename: resolve("./tests/file.tsx"),
});
