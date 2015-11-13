# js-transforms

A collection of js transforms using [jscodeshift](https://github.com/facebook/jscodeshift)


## Setup & Run

- `npm i -g jscodeshift`
- clone this repo
- `jscodeshift -t <path-to-codemod> <path-or-file>`
- Use the `-d` option for a dry-run and use `-p` to print the output for comparison


## Included Scripts


### `split-vars`

Split variable declarations that has more that one variable declarator into multiple variable declarations with one variable declarator each.

#### Example

```
jscodeshift -t js-transforms/transforms/split-vars.js project/lib
```

##### Input

```js
var x = 1, y;
const A = 'a', B = 'b';
let i, j;
```

##### Output

```js
var x = 1;
var y;
const A = 'a';
const B = 'b';
let i;
let j;
```


### `test-setup-arrow`

Finds all calls to mochas `before`, `after`, `beforeEach` and `afterEach` functions in tests and transforms the function callback into an arrow function. If the function is a named function then an argument is inserted with a string literal of the name.

#### Example

```
jscodeshift -t js-transforms/transforms/test-setup-arrow.js project/test
```

##### Input

```js
beforeEach(function setupMockServer() {
  return mockServer.start();
});
```

##### Output

```js
beforeEach('setupMockServer', () => mockServer.start());
```
