# Enforce the use of a suffix in subject identifiers (`rxjs-x/suffix-subjects`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if subject variables, properties and parameters don't conform to a naming scheme that identifies them as subjects.

> [!NOTE]
> This rule is designed to be optionally compatible with [`finnish`](./finnish.md).
> Using Finnish notation (adding a `$` suffix) your subject names will _not_ cause a failure of this rule.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answers = new Subject<number>();
```

Examples of **correct** code for this rule:

```ts
const answersSubject = new Subject<number>();
const answersSubject$ = new Subject<number>();

// The static observable creators that accept a sources object are exempt from this rule.
combineLatest({ answers: new Subject<number>() });
```

## Options

<!-- begin auto-generated rule options list -->

| Name         | Description                                                                | Type    |
| :----------- | :------------------------------------------------------------------------- | :------ |
| `objects`    | Require for object literal keys.                                           | Boolean |
| `parameters` | Require for parameters.                                                    | Boolean |
| `properties` | Require for properties, except object literal keys (see "objects" option). | Boolean |
| `suffix`     | The suffix to enforce.                                                     | String  |
| `types`      | Enforce for specific types. Keys are a RegExp, values are a boolean.       | Object  |
| `variables`  | Require for variables.                                                     | Boolean |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with properties that determine whether subject suffixes are enforced for `parameters`, `properties`, `objects`, and `variables`.
It also contains a `types` property that determine whether or not the naming convention is to be enforced for specific types
and a `suffix` property.

The default (Angular-friendly) configuration looks like this:

```json
{
  "rxjs-x/suffix-subjects": [
    "error",
    {
      "parameters": true,
      "properties": true,
      "objects": true,
      "suffix": "Subject",
      "types": {
        "^EventEmitter$": false
      },
      "variables": true,
    }
  ]
}
```

The properties in the options object are themselves optional; they do not all have to be specified.

> [!TIP]
> This rule will skip `method` enforcement if the `override` keyword is present.
> Users are encouraged to enable `noImplicitOverride` in their `tsconfig.json` to take advantage of this.

## When Not To Use It

If you don't use suffixes on your project's subjects, then you don't need this rule.
However, keep in mind that inconsistent style can harm readability in a project.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Related To

- [`finnish`](./finnish.md)

## Resources

- [Rule source](/src/rules/suffix-subjects.ts)
- [Test source](/tests/rules/suffix-subjects.test.ts)
