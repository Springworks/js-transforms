(() => {
  var x;
  for (x in obj) {
    foo(x);
  }
  foo(x);

  for (x in obj) {
    foo(x);
  }
})();
