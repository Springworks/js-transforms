var createError = require('@springworks/error-factory').create;

exports.someFunction = function() {
  return doTheThing().catch(handleError);
};


function handleError(err) {
  log(err, 'Log message');
  throw createError(500, 'Oh no!');
}
