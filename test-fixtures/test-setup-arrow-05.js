describe(__filename, function() {

  before(function namedBefore(done) {
    done();
    return 'name in before with done callback';
  });

  after(function namedAfter(done) {
    done();
    return 'name in after with done callback';
  });

  beforeEach(function namedBeforeEach(done) {
    done();
    return 'name in beforeEach with done callback';
  });

  afterEach(function namedAfterEach(done) {
    done();
    return 'name in afterEach with done callback';
  });

});
