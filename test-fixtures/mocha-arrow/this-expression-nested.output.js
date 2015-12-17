describe(__filename, () => {

  before(() => {
    foo(function() {
      this.bar();
    });
  });

});
