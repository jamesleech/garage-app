/* eslint-disable global-require,no-underscore-dangle */
if (__DEV__ === true) {
  module.exports = require('./configureStore.dev');
} else {
  module.exports = require('./configureStore.prod');
}
