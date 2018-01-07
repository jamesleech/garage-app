import { linkDevice, getDeviceKey } from './index';
import { saveDevice } from '../knownDevices';
import { takeLatest, call, put } from 'redux-saga/effects';
import {bleScanStop} from '../ble';

function* linkDeviceWorker(action) {
  yield put(bleScanStop.request());

  const { device } = action.payload;
  yield call(console.log,`linkDeviceWorker ${device.id} - ${device.name}`);

  device.status = 'notConnected';
  // TODO: navigate to screen to get secret key from user
  device.key = '0123456789abcdef';
  yield put(saveDevice.request({ device }));

  yield put(linkDevice.success(device));
}

function* gotDeviceKeyWorker(action) {
  const { device } = action.payload;
  yield call(console.log,`linkDeviceWorker ${device.id} - ${device.name}`);

  // add to persistent store
  const saveResult = yield call(saveDevice.call(device));
  yield call(console.log(`saveResult: ${JSON.stringify(saveResult)}`));
}

export function* saga() {
  yield takeLatest(linkDevice.REQUEST, linkDeviceWorker);
  yield takeLatest(getDeviceKey.SUCCESS, gotDeviceKeyWorker);
}
