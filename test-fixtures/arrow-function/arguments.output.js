var fn1 = function() {
  return foo(arguments);
};

var fn2 = x => function() {
  foo(x, arguments);
};
