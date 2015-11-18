var ErrorFactory = require('@springworks/error-factory');

exports.someFunction = function(callback) {
  doTheThing(function(err, val) {
    if (err) {
      callback(ErrorFactory.create({
        code: 500,
        message: 'Oh no!',
        cause: err
      }));
      return;
    }

    callback(null, val);
  });
};
