describe(__filename, function() {

  before(function(done) {
    done();
    return 'no name in before with done callback';
  });

  after(function(done) {
    done();
    return 'no name in after with done callback';
  });

  beforeEach(function(done) {
    done();
    return 'no name in beforeEach with done callback';
  });

  afterEach(function(done) {
    done();
    return 'no name in afterEach with done callback';
  });

});
