var f1 = function() {
  fn(function() {
    return this.foo();
  }.bind(this));
};

var f2 = function(y) {
  return fn(function(x) {
    return this.foo(x, y);
  }.bind(this));
};
