(() => {
  var [a, b] = arr;
})();

(() => {
  var [a, b] = arr;
  a = 1;
})();

(() => {
  var [a, b] = arr;
  a = 1;
  b = 2;
})();

(() => {
  var [i] = arr;
  i++;
})();
