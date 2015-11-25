describe(__filename, function() {

  before(function() {
    value = foo();
  });

  after(function() {
    value = foo();
  });

  beforeEach(function() {
    value = foo();
  });

  afterEach(function() {
    value = foo();
  });

});
