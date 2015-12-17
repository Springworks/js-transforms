describe(__filename, function() {

  it('should work', function() {
    foo.should.eql(bar);
  });

  it('should work', function(done) {
    foo.should.eql(bar);
    done();
  });

  it('should work', function() {
    return foo();
  });

});
