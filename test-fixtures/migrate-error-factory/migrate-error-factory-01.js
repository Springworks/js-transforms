var createError = require('@springworks/error-factory').create;

createError();
createError(400);

exports.someFunction = function(callback) {
  createError();

  doTheThing(function(err, val) {
    if (err) {
      callback(createError(500, 'Oh no!'));
      return;
    }

    callback(null, val);
  });
};
