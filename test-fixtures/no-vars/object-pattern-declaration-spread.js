(() => {
  var { ...a } = obj;
})();

(() => {
  var { ...a } = obj;
  a = Object.keys(a);
})();

(() => {
  var { ...a } = obj;
  a.key++;
})();
