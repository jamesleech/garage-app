import { loadDevices, saveDevice, removeDevice } from './index';
import { takeLatest, call, put } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { bleDeviceDisconnect } from '../ble';

const deviceKey = 'DEVICE:';
const deviceKeyId = id => `${deviceKey}${id}`;

function* loadDevicesWorker() {
  yield call(console.log, `loadDevicesWorker`);
  const keysResult = yield call(AsyncStorage.getAllKeys);
  yield call(console.log, `loadDevicesWorker.getAllKeys: ${keysResult}`);
  try {
    const deviceKeys = keysResult.filter(key => key.startsWith(deviceKey));
    yield call(console.log, `loadDevicesWorker.filtered keys: ${deviceKeys}`);

    const devices = [];
    if(deviceKeys.length > 0) {
      yield call(console.log, `loadDevicesWorker: loading (${deviceKeys.length}) devices`);
      // const devices = yield call(AsyncStorage.multiGet, deviceKeys); //doesn't workie
      // maybe 10 max in a single app... so lets go one at a time.
      for(let i = 0; i < deviceKeys.length; i++) {
        let device = yield call(AsyncStorage.getItem, deviceKeys[i]);
        device = JSON.parse(device);
        device.status = 'notConnected';
        device.rssi = null;
        devices.push(device);
      }
    }
    yield call(console.log, `load devices success`);
    yield put(loadDevices.success(devices));

  } catch (error){
    yield call(console.log, `loadDevicesWorks error: ${error}`);
    yield put(loadDevices.failure(error));
  }
}

function* saveDeviceWorker(action) {
  const { device } = action.payload;
  yield call(console.log, `saveDeviceWorker: ${device.id} - ${device.name}`);

  try {
    // validate the device
    if (device.id && device.name && device.key) {
      // add to persistent store
      yield call(AsyncStorage.setItem, deviceKeyId(device.id), JSON.stringify(device));
      yield put(saveDevice.success(device));
    } else {
      yield put(saveDevice.failure(device));
    }
  } catch (error) {
    yield call(console.error, `saveDeviceWorker: error`);
    yield put(saveDevice.failure(device));
  }
}

function* removeDeviceWorker(action) {
  const device = action.payload;
  yield call(console.log,`removeDeviceWorker: ${device.id} - ${device.name}`);

  try {
    if(device.id) {
      yield put(bleDeviceDisconnect.request(device));
      yield call(AsyncStorage.removeItem, deviceKeyId(device.id));
      yield put(removeDevice.success(device));
    } else {
      yield put(removeDevice.failure('need a device id to remove'));
    }
  } catch (error) {
    yield call(console.error, `removeDeviceWorker: error`);
    yield put(removeDevice.failure('need a device id to remove'));
  }
}

export function* saga() {
  yield takeLatest(loadDevices.REQUEST, loadDevicesWorker);
  yield takeLatest(saveDevice.REQUEST, saveDeviceWorker);
  yield takeLatest(removeDevice.REQUEST, removeDeviceWorker);
}
