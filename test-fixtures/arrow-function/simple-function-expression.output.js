var f1 = () => {
  foo();
};

var f2 = x => {
  foo(x);
};

var f3 = (x, y) => {
  foo(x, y);
};

var f4 = () => foo();

var f5 = x => foo(x);

var f6 = (x, y) => foo(x, y);

var f7 = (x, cb) => foo(x, (err, y) => cb(y));
