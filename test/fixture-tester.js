'use strict';

const fs = require('fs');
const joinPath = require('path').join;
const jscodeshift = require('jscodeshift');

const read = name => fs.readFileSync(joinPath(__dirname, '../test-fixtures', name), 'utf8');


function testFixture(transform_name, test_file_name, options) {
  const source = read(test_file_name + '.js');
  const output = read(test_file_name + '.output.js');
  const transform = require(joinPath(__dirname, '../transforms', transform_name + '.js'));

  const actual = (transform({ path: test_file_name + '.js', source: source }, { jscodeshift: jscodeshift }, options || {}) || '').trim();
  const expected = output.trim();
  assertFileDiff(actual, expected, test_file_name);
}


function assertFileDiff(actual, expected, test_file_name) {
  if (actual === expected) {
    return;
  }

  if (!actual) {
    throw new Error('Expected ' + test_file_name + ' to have been modified.');
  }

  if (!expected) {
    throw new Error('Expected ' + test_file_name + ' to not have been modified.');
  }

  const error = new Error('Expected ' + test_file_name + ' to match the fixture.');
  error.actual = actual;
  error.expected = expected;
  throw error;
}


module.exports = function(transform_name, variations, options) {
  describe(transform_name, function() {
    variations.map(variation => transform_name + '-' + variation).forEach(name => {
      it(name, () => {
        testFixture(transform_name, name, options);
      });
    });
  });
};
