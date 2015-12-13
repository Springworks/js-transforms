(() => {
  const [...a] = arr;
})();

(() => {
  const [a, b, ...c] = arr;
})();

(() => {
  let [a, b, ...c] = arr;
  c = c.sort();
})();

(() => {
  const [...a] = arr;
  a[0]++;
})();
