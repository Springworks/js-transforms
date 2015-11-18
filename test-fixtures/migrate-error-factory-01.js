var createError = require('@springworks/error-factory').create;

exports.someFunction = function(callback) {
  doTheThing(function(err, val) {
    if (err) {
      callback(createError(500, 'Oh no!'));
      return;
    }

    callback(null, val);
  });
};
