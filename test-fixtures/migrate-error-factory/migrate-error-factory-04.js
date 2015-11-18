var ErrorFactory = require('@springworks/error-factory');

exports.someFunction = function() {
  return doTheThing().catch(handleError);
};


function handleError(err) {
  log(err, 'Log message');
  throw ErrorFactory.create(500, 'Oh no!');
}
