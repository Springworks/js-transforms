let x = 1;
let y = 2;
let z = 3;
const c1 = 1;
const c2 = 2;

function fn() {
  var a = 1;
  var b = 2;
  for (let i = 0, l = 3; i < l; i++) {
    var foo;
    var bar;
    b = i;
    console.log(i);

    if (i === 0) {
      let c = l;
      let d;
    }
  }
}
