describe(__filename, () => {

  it('should work', () => {
    foo.should.eql(bar);
  });

  it('should work', done => {
    foo.should.eql(bar);
    done();
  });

  it('should work', () => {
    return foo();
  });

});
