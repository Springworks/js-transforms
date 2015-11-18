var ErrorFactory = require('@springworks/error-factory');

exports.someFunction = function(callback) {
  doTheThing(function(err, val) {
    if (err) {
      callback(ErrorFactory.create(500, 'Oh no!'));
      return;
    }

    callback(null, val);
  });
};
