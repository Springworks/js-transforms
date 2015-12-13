var array = ['a', 'b', 'c', 'd'];

for (var letter of array) {
  letter += 'x';
  console.log(letter);
}

var map = new Map([[1, 2], [3, 4]]);
for (var [key, value] of map.entries()) {
  value += 1;
  console.log(key, value);
}

(() => {
  var a = [1, 2, 3];
  for (var i of array) {
    i++;
  }
})();
