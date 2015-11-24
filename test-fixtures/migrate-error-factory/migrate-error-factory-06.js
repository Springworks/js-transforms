import { create as localName } from '@springworks/error-factory';

exports.someFunction = function(callback) {
  doTheThing(function(err, val) {
    if (err) {
      callback(localName(500, 'Oh no!'));
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
  throw localName(500, 'Oh no!');
}
