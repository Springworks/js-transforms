var ErrorFactory = require('@springworks/error-factory');

exports.someFunction = (callback) => {
  doTheThing((err, val) => {
    if (err) {
      callback(ErrorFactory.createError({
        code: 500,
        message: 'Oh no!',
        cause: err
      }));
      return;
    }

    callback(null, val);
  });
};
