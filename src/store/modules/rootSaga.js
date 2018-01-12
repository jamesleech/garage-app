import { fork, all, call } from 'redux-saga/effects';
import { splashSaga, restore } from './splash';
import { signInSaga } from './signIn';
import { homeSaga} from './home';
import { bleSaga } from './ble';
import { linkDeviceSaga } from './linkDevice';
import { knownDevicesSaga } from './knownDevices';

function* restoreSaga() {
  yield call(restore.call, {});
}

export function* rootSaga () {
  yield all([
    fork(splashSaga),
    fork(signInSaga),
    fork(knownDevicesSaga),
  ]);

  yield call(restoreSaga);

  yield all([
    fork(bleSaga),
    fork(homeSaga),
    fork(linkDeviceSaga),
  ]);
}
