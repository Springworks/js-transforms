var createError = require('@springworks/error-factory').create;

function fn() {
  try {
    foo();
  }
  catch (err) {
    throw createError();
  }
}
