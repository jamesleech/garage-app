import { fork, all, call, put, take } from 'redux-saga/effects';
import { splashSaga, restore } from './splash';
import { signInSaga } from './signIn';
import { homeSaga} from './home';
import { bleSaga } from './ble';

function* restoreSaga() {
  yield call(restore.call, {});
}

export function* rootSaga () {
  // start the signInSaga.
  yield fork(splashSaga);
  yield fork(signInSaga);

  yield call(restoreSaga);

  yield all([
    fork(bleSaga),
    fork(homeSaga),
  ]);
}
