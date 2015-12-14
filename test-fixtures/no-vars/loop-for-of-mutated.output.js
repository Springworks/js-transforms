const array = ['a', 'b', 'c', 'd'];

for (let letter of array) {
  letter += 'x';
  console.log(letter);
}

const map = new Map([[1, 2], [3, 4]]);
for (let [key, value] of map.entries()) {
  value += 1;
  console.log(key, value);
}

(() => {
  const a = [1, 2, 3];
  for (let i of array) {
    i++;
  }
})();
