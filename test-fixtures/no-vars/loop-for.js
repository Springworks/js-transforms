(() => {
  for (var i = 0; i < 10; i++) {
  }
})();

(() => {
  for (var i = 0; i < 10; i++) {
    foo(i);
  }
})();

(() => {
  for (var i = 0, extra; i < 10; i++) {
    extra = i + 1;
    foo(i, extra);
  }
})();

function fn1(arr) {
  var i, l;
  for (i = 0, l = arr.length; i < l; i++) {
    foo(arr[i]);
  }
}

function fn2() {
  var i = 0;
  for (var j = 0; i < 10; i++) {
    foo(i);
  }
}

(() => {
  for (var i = 0; i < 10; i++) {
    setTimeout(() => console.log(i));
  }
})();
