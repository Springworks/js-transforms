describe(__filename, () => {

  before(() => {
    foo();
  });

  after(() => {
    foo();
  });

  beforeEach(() => {
    foo();
  });

  afterEach(() => {
    foo();
  });

});
