describe(__filename, function() {

  before(done => {
    done();
    return 'no name in before with done callback';
  });

  after(done => {
    done();
    return 'no name in after with done callback';
  });

  beforeEach(done => {
    done();
    return 'no name in beforeEach with done callback';
  });

  afterEach(done => {
    done();
    return 'no name in afterEach with done callback';
  });

});
