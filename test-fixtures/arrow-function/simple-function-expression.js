var f1 = function() {
  foo();
};

var f2 = function(x) {
  foo(x);
};

var f3 = function(x, y) {
  foo(x, y);
};

var f4 = function() {
  return foo();
};

var f5 = function(x) {
  return foo(x);
};

var f6 = function(x, y) {
  return foo(x, y);
};

var f7 = function(x, cb) {
  return foo(x, function(err, y) {
    return cb(y);
  });
};
