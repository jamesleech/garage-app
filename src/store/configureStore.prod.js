// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { getRootReducer, rootSaga } from './index';

const sagaMiddleware = createSagaMiddleware();

const configureStore = (navReducer: any) => {
  console.log(`configureStore for production environment`);
  const store = createStore(
    getRootReducer(navReducer),
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
