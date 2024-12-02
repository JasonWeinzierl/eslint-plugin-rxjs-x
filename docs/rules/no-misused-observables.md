# Disallow Observables in places not designed to handle them (`rxjs-x/no-misused-observables`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

## Options

<!-- WARNING: not auto-generated! -->

| Name               | Description                                                                                                                              | Type    | Default |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :------ | :------ |
| `checksSpreads`    | Disallow `...` spreading an Observable.                                                                                                  | Boolean | `true`  |
| `checksVoidReturn` | Disallow returning an Observable from a function typed as returning `void`.                                                              | Object  | `true`  |

### `checksVoidReturn`

You can disable selective parts of the `checksVoidReturn` option. The following sub-options are supported:

| Name               | Description                                                                                                                              | Type    | Default |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :------ | :------ |
| `arguments`        | Disallow passing an Observable-returning function as an argument where the parameter type expects a function that returns `void`.        | Boolean | `true`  |
| `attributes`       | Disallow passing an Observable-returning function as a JSX attribute expected to be a function that returns `void`.                      | Boolean | `true`  |
| `inheritedMethods` | Disallow providing an Observable-returning function where a function that returns `void` is expected by an extended or implemented type. | Boolean | `true`  |
| `properties`       | Disallow providing an Observable-returning function where a function that returns `void` is expected by a property.                      | Boolean | `true`  |
| `returns`          | Disallow returning an Observable-returning function where a function that returns `void` is expected.                                    | Boolean | `true`  |
| `variables`        | Disallow assigning or declaring an Observable-returning function where a function that returns `void` is expected.                       | Boolean | `true`  |
