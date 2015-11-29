describe(__filename, function() {

  before(() => foo(function() {
    this.bar();
  }));

});
