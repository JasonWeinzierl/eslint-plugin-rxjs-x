# Disallow passing unbound methods (`rxjs-x/no-unbound-methods`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if unbound methods are passed as callbacks.

## Rule details

Examples of **incorrect** code for this rule:

```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map(this.extractSomeProperty),
    catchError(this.handleError)
  );
```

Examples of **correct** code for this rule:

```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map((s) => this.extractSomeProperty(s)),
    catchError((e) => this.handleError(e))
  );
```

```ts
return this.http
  .get<Something>("https://api.some.com/things/1")
  .pipe(
    map(this.extractSomeProperty.bind(this)),
    catchError(this.handleError.bind(this))
  );
```

## When Not To Use It

If every handler in your project does not depend on the `this` context in their implementations,
then in some cases it may be safe to not use this rule.
However, keep in mind that future changes may introduce bugs
by changing their implementations to depend on the `this` context;
see the linked blog post for best practice explanation.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Further reading

- [Avoiding unbound methods](https://ncjamieson.com/avoiding-unbound-methods/)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-unbound-methods.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-unbound-methods.test.ts)
