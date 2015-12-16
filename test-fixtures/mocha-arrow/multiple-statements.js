describe(__filename, function() {

  before(function() {
    const value = foo();
    return value;
  });

  after(function() {
    const value = foo();
    return value;
  });

  beforeEach(function() {
    const value = foo();
    return value;
  });

  afterEach(function() {
    const value = foo();
    return value;
  });

});
