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
      const source = read('.js');
      const output = read('.output.js');
      const expected = output.trim();

      describe(test_file_name, () => {

        it('should transform to expected output', () => {
          const options = {};
          const actual = (transform({ path: test_file_name + '.js', source: source }, { jscodeshift: jscodeshift }, options) || '').trim();
          assertFileDiff(actual, expected, source, transform_name, test_file_name, 'transform');
        });

        if (expected) {
          it('should not transform when rerun', () => {
            const options = {};
            const actual = (transform({ path: test_file_name + '.js', source: output }, { jscodeshift: jscodeshift }, options) || '').trim();
            if (actual) {
              assertFileDiff(actual, expected, source, transform_name, test_file_name, 'rerun');
            }
          });
        }

      });

    });

  });
});


function getFixtureNames(transform_name) {
  return fs.readdirSync(path.join(fixture_path, transform_name))
      .filter(name => name.indexOf('.output.js') < 0 && path.extname(name) === '.js')
      .map(name => path.basename(name, '.js'))
}


function assertFileDiff(actual, expected, source, transform_name, test_file_name, test_case) {
  if (actual === expected) {
    return;
  }

  const error = new Error(actual && expected
      ? 'Expected ' + test_file_name + ' to match the fixture.' : expected
      ? 'Expected ' + test_file_name + ' to have been modified.'
      : 'Expected ' + test_file_name + ' to not have been modified.');
  error.actual = actual || source;
  error.expected = expected;
  error.stack = transform_name + ' > ' + test_file_name + ' > ' + test_case;
  throw error;
}
