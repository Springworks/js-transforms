(() => {
  const { a, b } = obj;
})();

(() => {
  let { a, b } = obj;
  a = 1;
})();

(() => {
  let { a, b } = obj;
  a = 1;
  b = 2;
})();

(() => {
  let { a, b } = obj;
  a++;
  ++b;
})();
