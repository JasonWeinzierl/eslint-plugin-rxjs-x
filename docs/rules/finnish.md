# Enforce Finnish notation (`rxjs-x/finnish`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule enforces the use of Finnish notation - i.e. the `$` suffix.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answers = of(42, 54);
```

Examples of **correct** code for this rule:

```ts
const answer$ = of(42, 54);

// The static observable creators that accept a sources object are exempt from this rule.
combineLatest({ answer: of(42, 54) });
```

Examples of **incorrect** code with `strict` enabled:

```ts
const answer$ = 'green';
```

Examples of **correct** code with `strict` enabled but a specific name allowed:

```ts
/* eslint rxjs-x/finnish: ["error", { "strict": true, "names": { "^answer$": true } }] */
const answer$ = 'green';
```

## Options

<!-- begin auto-generated rule options list -->

| Name         | Description                                                          | Type    |
| :----------- | :------------------------------------------------------------------- | :------ |
| `functions`  | Require for functions.                                               | Boolean |
| `methods`    | Require for methods.                                                 | Boolean |
| `names`      | Enforce for specific names. Keys are a RegExp, values are a boolean. | Object  |
| `parameters` | Require for parameters.                                              | Boolean |
| `properties` | Require for properties.                                              | Boolean |
| `strict`     | Disallow Finnish notation for non-Observables.                       | Boolean |
| `types`      | Enforce for specific types. Keys are a RegExp, values are a boolean. | Object  |
| `variables`  | Require for variables.                                               | Boolean |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with properties that determine whether Finnish notation is enforced for `functions`, `methods`, `parameters`, `properties` and `variables`. It also contains:

- `names` and `types` properties that determine whether or not Finnish notation is to be enforced for specific names or types.
- a `strict` property that, if `true`, allows the `$` suffix to be used _only_ with identifiers that have an `Observable` type.

The default (Angular-friendly) configuration looks like this:

```json
{
    "rxjs-x/finnish": [
        "error",
        {
            "functions": true,
            "methods": true,
            "names": {
                "^(canActivate|canActivateChild|canDeactivate|canLoad|intercept|resolve|validate)$": false
            },
            "parameters": true,
            "properties": true,
            "strict": false,
            "types": {
                "^EventEmitter$": false
            },
            "variables": true
        }
    ]
}
```

The properties in the options object are themselves optional; they do not all have to be specified.

## When Not To Use It

If you don't use Finnish notation in your project or don't care about enforcing Finnish notation in your project, you don't need this rule.
However, keep in mind that inconsistent style can harm readability in a project;
consider using [`no-finnish`](./no-finnish.md) to ban Finnish notation if you don't use it in your project.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Further reading

- [Observables and Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b)

## Related To

- [`no-finnish`](./no-finnish.md)
- [`suffix-subjects`](./suffix-subjects.md)

## Resources

- [Rule source](/src/rules/finnish.ts)
- [Test source](/tests/rules/finnish.test.ts)
