describe(__filename, function() {

  before('namedBefore', () => 'name in before');

  after('namedAfter', () => 'name in after');

  beforeEach('namedBeforeEach', () => 'name in beforeEach');

  afterEach('namedAfterEach', () => 'name in afterEach');

});
