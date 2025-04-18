# Disallow calling `subscribe` without specifying an error handler (`rxjs-x/no-ignored-error`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule enforces the passing of an error handler to `subscribe` calls.

## Rule details

Examples of **incorrect** code for this rule:

```ts
source.subscribe((value) => console.log(value));
```

```ts
source.subscribe({
  next: (value) => console.log(value)
});
```

Examples of **correct** code for this rule:

```ts
source.subscribe(
  (value) => console.log(value),
  (error) => console.error(error)
);
```

```ts
source.subscribe({
  next: (value) => console.log(value),
  error: (error) => console.error(error)
});
```

## When Not To Use It

If you're not worried about ignored errors, then in some cases it may be safe to not use this rule.
Or if you use operators like `catchError` to handle all errors, then in some cases it may be safe to not use this rule.
You might consider using ESLint disable comments for those specific situations
instead of completely disabling this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](/src/rules/no-ignored-error.ts)
- [Test source](/tests/rules/no-ignored-error.test.ts)
