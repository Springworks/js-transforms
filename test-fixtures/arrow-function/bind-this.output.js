var f1 = function() {
  fn(() => this.foo());
};

var f2 = function(y) {
  return fn(x => this.foo(x, y));
};
