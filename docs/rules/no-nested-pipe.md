# Avoid nested `pipe` calls (`no-nested-pipe`)

This rule effects failures if `pipe` is called within a `pipe` handler.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { switchMap, map, of } from 'rxjs';

of('searchText1', 'searchText2')
  .pipe(
    switchMap(searchText => {
      return callSearchAPI(searchText).pipe(
        map(response => {
          console.log(response);
          return 'final ' + response;
          // considering more lines here
        })
      );
    })
  )
  .subscribe(value => console.log(value));

function callSearchAPI(searchText) {
  return of('new' + searchText);
}


```

Examples of **correct** code for this rule:

```ts
import { switchMap, map, of } from 'rxjs';

of('searchText1', 'searchText2')
  .pipe(
    switchMap(searchText => {
      return callSearchAPI(searchText);
    })
  )
  .subscribe(value => console.log(value));

function callSearchAPI(searchText) {
  return of('new' + searchText).pipe(
    map(response => {
      console.log(response);
      return 'final ' + response;
      // considering more lines here
    })
  );
}

```

## Options

This rule has no options.
