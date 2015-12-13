(() => {
  for (let i = 0; i < 10; i++) {
  }
})();

(() => {
  for (let i = 0; i < 10; i++) {
    foo(i);
  }
})();

(() => {
  for (let i = 0, extra; i < 10; i++) {
    extra = i + 1;
    foo(i, extra);
  }
})();

function fn1(arr) {
  let i, l;
  for (i = 0, l = arr.length; i < l; i++) {
    foo(arr[i]);
  }
}

function fn2() {
  let i = 0;
  for (const j = 0; i < 10; i++) {
    foo(i);
  }
}

(() => {
  for (var i = 0; i < 10; i++) {
    setTimeout(() => console.log(i));
  }
})();
