describe(__filename, function() {

  before(function() {
    foo(function() {
      this.bar();
    });
  });

});
