(() => {
  // should not destroy comments
  var a = null;
  if (fn()) {
    ([a] = foo());
  }
})();
