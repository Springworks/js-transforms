const a = 1;
let b = 2;
let c = 3;

function mutator() {
  b += 1;
}

c = foo(a, b, c);

(() => {
  let v = 1;
  return () => {
    return a => b => c => {
      v = c;
    };
  };
})();
