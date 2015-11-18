var createError = require('@springworks/error-factory').createError;

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
