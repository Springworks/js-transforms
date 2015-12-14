(() => {
  const { ...a } = obj;
})();

(() => {
  let { ...a } = obj;
  a = Object.keys(a);
})();

(() => {
  const { ...a } = obj;
  a.key++;
})();
