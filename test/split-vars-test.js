const testFixture = require('./fixture-tester');

describe('split-vars', function() {

  it('should transform fixture 01', function() {
    testFixture('split-vars', 'split-vars-01');
  });

  it('should transform fixture 02', function() {
    testFixture('split-vars', 'split-vars-02');
  });

  it('should transform fixture 03', function() {
    testFixture('split-vars', 'split-vars-03');
  });

});
