describe(__filename, () => {

  before(() => {
    const value = foo();
    return value;
  });

  after(() => {
    const value = foo();
    return value;
  });

  beforeEach(() => {
    const value = foo();
    return value;
  });

  afterEach(() => {
    const value = foo();
    return value;
  });

});
