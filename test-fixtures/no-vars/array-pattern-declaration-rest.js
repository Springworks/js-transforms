(() => {
  var [...a] = arr;
})();

(() => {
  var [a, b, ...c] = arr;
})();

(() => {
  var [a, b, ...c] = arr;
  c = c.sort();
})();

(() => {
  var [...a] = arr;
  a[0]++;
})();
