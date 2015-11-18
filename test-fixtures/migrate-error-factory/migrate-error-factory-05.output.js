import { createError } from '@springworks/error-factory';

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

exports.someFunction = function() {
  return doTheThing().catch(handleError);
};


function handleError(err) {
  log(err, 'Log message');
  throw createError({
    code: 500,
    message: 'Oh no!',
    cause: err
  });
}
