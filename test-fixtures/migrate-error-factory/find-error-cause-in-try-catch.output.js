var createError = require('@springworks/error-factory').createError;

function fn() {
  try {
    foo();
  }
  catch (err) {
    throw createError({
      cause: err
    });
  }
}
