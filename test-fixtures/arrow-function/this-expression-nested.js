var f1 = function(x) {
  return function(y) {
    return this.foo(y, x);
  };
};

var f2 = function(x) {
  function inner_fn(y) {
    return this.foo(y, x);
  }

  return inner_fn;
};
