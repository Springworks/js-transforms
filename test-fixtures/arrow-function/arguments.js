var fn1 = function() {
  return foo(arguments);
};

var fn2 = function(x) {
  return function() {
    foo(x, arguments);
  };
};
