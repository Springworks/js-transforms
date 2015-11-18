let x = 1, y = 2, z = 3;

const c1 = 1, c2 = 2;

function fn() {
  var a = 1, b = 2;
  for (let i = 0, l = 3; i < l; i++) {
    var foo, bar;
    b = i;
    console.log(i);

    if (i === 0) {
      let c = l, d;
    }
  }
}
