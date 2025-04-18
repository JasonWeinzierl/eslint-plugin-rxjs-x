# Disallow public and protected subjects (`rxjs-x/no-exposed-subjects`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule prevents exposed (i.e. non-private) subjects. Developers should instead expose observables via the subjects' `asObservable` method.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { Subject } from "rxjs";
class Answers {
  public answers: Subject<number>;
}
```

Examples of **correct** code for this rule:

```ts
import { Subject } from "rxjs";

class Answers {
  private answersSubject$ = new Subject<string>();
  public answers$ = this.answersSubject$.asObservable();

  public nextAnswer(a: string) {
    this.answersSubject$.next(a);
  }
}
```

## Options

<!-- begin auto-generated rule options list -->

| Name             | Description               | Type    | Default |
| :--------------- | :------------------------ | :------ | :------ |
| `allowProtected` | Allow protected subjects. | Boolean | `false` |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `allowProtected` property that determines whether or not protected subjects are allowed. By default, they are not.

```json
{
  "rxjs-x/no-exposed-subjects": [
    "error",
    { "allowProtected": true }
  ]
}
```

## When Not To Use It

If you don't care about encapsulating subjects in your project, then you don't need this rule.
However, be aware that anyone can call `next()` or `complete()` on the exposed subject, which may cause bugs or less readable code.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](/src/rules/no-exposed-subjects.ts)
- [Test source](/tests/rules/no-exposed-subjects.test.ts)
