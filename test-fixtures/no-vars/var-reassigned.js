var a = 1;
var b = 2;
var c = 3;

function mutator() {
  b += 1;
}

c = foo(a, b, c);

(() => {
  var v = 1;
  return () => {
    return a => b => c => {
      v = c;
    };
  };
})();
