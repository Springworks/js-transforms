describe(__filename, function() {

  before(function() {
    foo();
  });

  after(function() {
    foo();
  });

  beforeEach(function() {
    foo();
  });

  afterEach(function() {
    foo();
  });

});
