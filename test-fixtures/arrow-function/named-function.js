var f1 = function fn1() {
  return 1;
};

var f2 = function(x) {
  return function fn2() {
    return x;
  };
};
