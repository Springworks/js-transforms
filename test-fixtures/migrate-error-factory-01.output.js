var createError = require('@springworks/error-factory').createError;

exports.someFunction = function(callback) {
  doTheThing(function(err, val) {
    if (err) {
      callback(createError({
        code: 500,
        message: 'Oh no!',
        cause: err
      }));
      return;
    }

    callback(null, val);
  });
};
