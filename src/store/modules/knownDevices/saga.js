import { loadDevices, saveDevice, removeDevice } from './index';
import { takeLatest, call, put } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';

const deviceKey = 'DEVICE:';
const deviceKeyId = id => `${deviceKey}${id}`;

function* loadDevicesWorker() {
  yield call(console.log, `loadDevicesWorker`);
  const keysResult = yield call(AsyncStorage.getAllKeys);
  yield call(console.log, `loadDevicesWorker.getAllKeys: ${keysResult}`);
  try {
    const deviceKeys = keysResult.filter(key => key.startsWith(deviceKey));
    yield call(console.log, `loadDevicesWorker.filtered keys: ${deviceKeys}`);

    if(deviceKeys.length > 0) {
      yield call(console.log, `loadDevicesWorker multi getting (${deviceKeys.length}) devices`);
      const devices = yield call(AsyncStorage.multiGet, deviceKeys);
      yield call(console.log, `loadDevicesWorker.devices: ${JSON.stringify(devices)}`);
    }

    yield call(console.log, `load devices success`);


    yield put(loadDevices.success({ }));
  } catch (error){
    yield call(console.log, `loadDevicesWorks error: ${error}`);
    yield put(loadDevices.failure(error));
  }
}

function* saveDeviceWorker(action) {
  const { device } = action.payload;
  yield call(console.log, `saveDeviceWorker: ${device.id} - ${device.name}`);

  // validate the device
  if(device.id && device.name && device.key) {
    // add to persistent store
    yield call(AsyncStorage.setItem, deviceKeyId(device.id), JSON.stringify(device));
    yield put(saveDevice.success(device));
  } else {
    yield put(saveDevice.failure(device));
  }
}

function* removeDeviceWorker(action) {
  const { device } = action.payload;
  yield call(console.log,`removeDeviceWorker: ${device.id} - ${device.name}`);

  // TODO: remove to persistent store
  if(device.id) {
    const result = yield call(AsyncStorage.removeItem, deviceKeyId(device.id));
    yield call(console.log, `removeDeviceResult: ${result}`);
    yield put(removeDevice.success(device));
  } else {
    yield put(removeDevice.failure('need a device id to remove'));
  }
}

export function* saga() {
  yield takeLatest(loadDevices.REQUEST, loadDevicesWorker);
  yield takeLatest(saveDevice.REQUEST, saveDeviceWorker);
  yield takeLatest(removeDevice.REQUEST, removeDeviceWorker);
}