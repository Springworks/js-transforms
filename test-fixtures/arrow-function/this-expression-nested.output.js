var f1 = x => function(y) {
  return this.foo(y, x);
};

var f2 = x => {
  function inner_fn(y) {
    return this.foo(y, x);
  }

  return inner_fn;
};
