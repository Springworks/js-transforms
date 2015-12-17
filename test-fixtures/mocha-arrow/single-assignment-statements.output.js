describe(__filename, () => {

  before(() => {
    value = foo();
  });

  after(() => {
    value = foo();
  });

  beforeEach(() => {
    value = foo();
  });

  afterEach(() => {
    value = foo();
  });

});
