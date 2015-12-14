var array = ['a', 'b', 'c', 'd'];

for (var letter of array) {
  console.log(letter);
}

for (let x of array) {
  console.log(x);
}

var map = new Map([[1, 2], [3, 4]]);
for (var [key, value] of map.entries()) {
  console.log(key, value);
}
for (let [k, v] of map.entries()) {
  console.log(k, v);
}
