const array = ['a', 'b', 'c', 'd'];

for (const letter of array) {
  console.log(letter);
}

for (const x of array) {
  console.log(x);
}

const map = new Map([[1, 2], [3, 4]]);
for (const [key, value] of map.entries()) {
  console.log(key, value);
}
for (const [k, v] of map.entries()) {
  console.log(k, v);
}
