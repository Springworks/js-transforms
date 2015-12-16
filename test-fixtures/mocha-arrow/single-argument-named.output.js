describe(__filename, () => {

  before('namedBefore', done => {
    done();
    return 'name in before with done callback';
  });

  after('namedAfter', done => {
    done();
    return 'name in after with done callback';
  });

  beforeEach('namedBeforeEach', done => {
    done();
    return 'name in beforeEach with done callback';
  });

  afterEach('namedAfterEach', done => {
    done();
    return 'name in afterEach with done callback';
  });

});
