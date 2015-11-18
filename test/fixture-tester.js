'use strict';

const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');

const fixture_path = path.join(__dirname, '../test-fixtures');
const fixture_dirs = fs.readdirSync(fixture_path).filter(name => fs.statSync(path.join(fixture_path, name)).isDirectory());


fixture_dirs.forEach(transform_name => {
  const transform = require(path.join(__dirname, '../transforms', transform_name));

  describe(transform_name, () => {

    getFixtureNames(transform_name).forEach(test_file_name => {
      const read = ext => fs.readFileSync(path.join(fixture_path, transform_name, test_file_name + ext), 'utf8');
      it(test_file_name, () => {
        const source = read('.js');
        const output = read('.output.js');

        const options = {};
        const actual = (transform({ path: test_file_name + '.js', source: source }, { jscodeshift: jscodeshift }, options) || '').trim();
        const expected = output.trim();
        assertFileDiff(actual, expected, test_file_name);
      });
    });

  });
});


function getFixtureNames(transform_name) {
  return fs.readdirSync(path.join(fixture_path, transform_name))
      .filter(name => name.indexOf('.output.js') < 0 && path.extname(name) === '.js')
      .map(name => path.basename(name, '.js'))
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
