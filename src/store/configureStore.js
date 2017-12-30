import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { getRootReducer, rootSaga } from './modules';

const sagaMiddleware = createSagaMiddleware();

const configureStore = (navReducer) => {
  const store = createStore(
    getRootReducer(navReducer),
    applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;
