(() => {
  var a = {};
  if (fn()) {
    ({ a } = foo());
  }
})();

(() => {
  var a = {};
  if (fn()) {
    ({ key: a } = foo());
  }
})();
