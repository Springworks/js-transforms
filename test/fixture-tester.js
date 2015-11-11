const assert = require('assert');
const readFileSync = require('fs').readFileSync;
const joinPath = require('path').join;
const jscodeshift = require('jscodeshift');

const read = name => readFileSync(joinPath(__dirname, '../test-fixtures', name), 'utf8');

module.exports = function(transform_name, test_file_name, options) {
  const source = read(test_file_name + '.js');
  const output = read(test_file_name + '.output.js');
  const transform = require(joinPath(__dirname, '../transforms', transform_name + '.js'));

  const actual = (transform({ path: path = test_file_name + '.js', source: source }, {jscodeshift:jscodeshift}, options || {}) || '').trim();
  const expected = output.trim();
  assert.strictEqual(actual, expected);
};
