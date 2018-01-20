// @flow
import { fork, all, call } from 'redux-saga/effects';
import { splashSaga, restore } from './splash';
import { signInSaga } from './signIn';
import { bleSaga } from './ble';
import { linkDeviceSaga } from './linkDevice';
import { knownDevicesSaga } from './knownDevices';

function* restoreSaga() {
  yield call(restore.call, {});
}

export function* rootSaga(): Generator<*,*,*> {

  try {
    yield all([
      fork(splashSaga),
      fork(signInSaga),
      fork(knownDevicesSaga),
    ]);

    yield all([
      fork(bleSaga),
      fork(linkDeviceSaga),
    ]);

    yield call(restoreSaga);

  } catch (error) {
    console.log(error);
    throw error;
  }
}
