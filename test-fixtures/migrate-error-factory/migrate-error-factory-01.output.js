var createError = require('@springworks/error-factory').createError;

createError({});
createError({
  code: 400
});

exports.someFunction = function(callback) {
  createError({});

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
