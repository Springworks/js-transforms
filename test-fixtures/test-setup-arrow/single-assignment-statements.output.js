describe(__filename, function() {

  before(() => value = foo());

  after(() => value = foo());

  beforeEach(() => value = foo());

  afterEach(() => value = foo());

});
