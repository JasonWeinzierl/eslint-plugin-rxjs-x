# Avoid nested `pipe` calls (`no-nested-pipe`)

This rule effects failures if `pipe` is called within a `pipe` handler.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of, timer } from "rxjs";

of("searchText1", "searchText2").pipe(switchMap((searchText) => {
	return this.callSearchAPI(searchText).pipe(map(response => {
               ......
               ......
// considering more lines here
	})
})
```

Examples of **correct** code for this rule:

```ts
import { of, timer } from "rxjs";
import { mapTo, mergeMap } from "rxjs/operators";

of("searchText1", "searchText2").pipe(switchMap((searchText) => this.getDisplayResponse(searchText)))
 
function getDisplayResponse (){
this.callSearchAPI(searchText).pipe(map(response => {
               ......
               ......
 // considering more lines here
}

```

## Options

This rule has no options.
