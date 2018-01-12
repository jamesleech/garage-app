import { NavigationActions } from 'react-navigation';
import { takeLatest, call, put } from 'redux-saga/effects';
import { linkDevice, startLinkDevice } from './index';
import { saveDevice } from '../knownDevices';
import { bleScanStop } from '../ble';

function* linkDeviceWorker(action) {
  yield put(bleScanStop.request());

  const { device } = action.payload;
  yield call(console.log,`linkDeviceWorker ${JSON.stringify(device)}`);

  device.status = 'notConnected';
  // TODO: navigate to screen to get secret key from user

  yield put(NavigationActions.navigate({
    routeName: 'LinkDevice',
    params: {
      device,
    }
  }))
}

function* requestSaveDeviceWorker(action) {
  const device = action.payload;
  yield call(console.log,`requestSaveDeviceWorker ${device.id} - ${device.name}`);

  try {
    // add to persistent store
    const saveResult = yield call(saveDevice.call, device);
    yield call(console.log, `requestSaveDeviceWorker - saveResult: ${JSON.stringify(saveResult)}`);
    yield put(linkDevice.success(device));
    yield put(NavigationActions.back());
  } catch (error) {
    yield call(console.log, `requestSaveDeviceWorker error: ${error}`);
    yield put(linkDevice.failure(device));
  }
}

export function* saga() {
  yield takeLatest(startLinkDevice.REQUEST, linkDeviceWorker);
  yield takeLatest(linkDevice.REQUEST, requestSaveDeviceWorker);
}
