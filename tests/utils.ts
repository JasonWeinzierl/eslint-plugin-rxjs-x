import { resolve } from "path";
import { createRuleTester } from "./etc";

export const ruleTester = createRuleTester({
  filename: resolve("./tests/file.tsx"),
});
