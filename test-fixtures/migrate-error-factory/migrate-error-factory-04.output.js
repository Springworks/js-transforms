var ErrorFactory = require('@springworks/error-factory');

exports.someFunction = function() {
  return doTheThing().catch(handleError);
};


function handleError(err) {
  log(err, 'Log message');
  throw ErrorFactory.createError({
    code: 500,
    message: 'Oh no!',
    cause: err
  });
}
