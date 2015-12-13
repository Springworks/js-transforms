(() => {
  const [a, b] = arr;
})();

(() => {
  let [a, b] = arr;
  a = 1;
})();

(() => {
  let [a, b] = arr;
  a = 1;
  b = 2;
})();

(() => {
  let [i] = arr;
  i++;
})();
