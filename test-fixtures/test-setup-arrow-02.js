describe(__filename, function() {

  before(function namedBefore() {
    return 'name in before';
  });

  after(function namedAfter() {
    return 'name in after';
  });

  beforeEach(function namedBeforeEach() {
    return 'name in beforeEach';
  });

  afterEach(function namedAfterEach() {
    return 'name in afterEach';
  });

});
