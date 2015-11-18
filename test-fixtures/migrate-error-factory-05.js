import { create as createError } from '@springworks/error-factory';

exports.someFunction = function(callback) {
  doTheThing(function(err, val) {
    if (err) {
      callback(createError(500, 'Oh no!'));
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
  throw createError(500, 'Oh no!');
}
