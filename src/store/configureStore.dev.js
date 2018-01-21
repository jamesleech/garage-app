// @flow
import { createStore, applyMiddleware } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from 'remote-redux-devtools';
import createSagaMiddleware from 'redux-saga';
import { getRootReducer, rootSaga, bleDeviceFound } from './index';

const sagaMiddleware = createSagaMiddleware();

const configureStore = (navReducer: any) => {
  console.log(`configureStore for development environment`);
  const composeEnhancers = composeWithDevTools({
    realtime: true,
    actionsBlacklist: [bleDeviceFound.SUCCESS]
  });
  const store = createStore(
    getRootReducer(navReducer),
    /* preloadedState, */
    composeEnhancers(
      applyMiddleware(sagaMiddleware),
  ));

  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
