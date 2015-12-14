(() => {
  var { a, b } = obj;
})();

(() => {
  var { a, b } = obj;
  a = 1;
})();

(() => {
  var { a, b } = obj;
  a = 1;
  b = 2;
})();

(() => {
  var { a, b } = obj;
  a++;
  ++b;
})();
