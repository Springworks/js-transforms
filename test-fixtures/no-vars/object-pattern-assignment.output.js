(() => {
  let a = {};
  if (fn()) {
    ({ a } = foo());
  }
})();

(() => {
  let a = {};
  if (fn()) {
    ({ key: a } = foo());
  }
})();
