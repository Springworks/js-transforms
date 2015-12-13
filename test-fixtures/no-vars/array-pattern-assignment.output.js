(() => {
  // should not destroy comments
  let a = null;
  if (fn()) {
    ([a] = foo());
  }
})();
