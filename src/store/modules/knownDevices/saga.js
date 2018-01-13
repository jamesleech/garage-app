import { takeLatest, call, put, throttle } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { bleDeviceDisconnect, bleDeviceConnect, bleWriteCharacteristic} from '../ble';
import { loadDevices, saveDevice, removeDevice, toggleDoor } from '.';
import { createMsg } from './messages';

const GARAGE_SERVICE_UUID = "321CCACA-29A6-4D46-B2DB-9B5639948751";
const GARAGE_DOOR_CHARACTERISTIC_UUID = "D7C7B570-EEDA-11E7-BD5D-FB4762172F1A";

const COMMAND_TOOGLE_DOOR = '0x01';

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

    yield call(console.log, `loadDevicesWorker: load devices success ${JSON.stringify(devices)}`);
    yield put(loadDevices.success(devices));

  } catch (error){
    yield call(console.log, `loadDevicesWorks error: ${error}`);
    yield put(loadDevices.failure(error));
  }
}

function* connectLoadedDevicesWorker(action) {
  yield call(console.log, `connectLoadedDevicesWorker`);
  try {
    const devices = action.payload;
    for(let i = 0; i< devices.length; i++) {
      yield put(bleDeviceConnect.request(devices[i]));
    }
  } catch (error) {
    yield call(console.log, `connectLoadedDevicesWorker error: ${error}`);
  }
}

function* saveDeviceWorker(action) {
  const device = action.payload;
  yield call(console.log, `saveDeviceWorker: ${deviceKeyId(device.id)} - ${JSON.stringify(device)}`);

  try {
    // validate the device
    if (device.id && device.name && device.key) {
      console.log('saveDeviceWorker: Device is valid');
      // add to persistent store
      yield call(AsyncStorage.setItem, deviceKeyId(device.id), JSON.stringify(device));
      console.log('saveDeviceWorker: AsyncStorage success');
      yield put(saveDevice.success(device));
    } else {
      console.log('saveDeviceWorker: AsyncStorage failure');
      yield put(saveDevice.failure(device));
    }
  } catch (error) {
    yield call(console.error, `saveDeviceWorker: error`);
    yield put(saveDevice.failure(device));
  }
}

function* toggleDoorWorker(action) {
  const { id } = action.payload;
  yield call(console.log, `toggleDoorWorker: ${id}`);

  try {
    // TODO: get a serial number
    // TODO: manage rolling counter
    // TODO: create a list of commands
    const msg = createMsg(4294967295, 1024, COMMAND_TOOGLE_DOOR);
    console.log(`toggleDoorWorker: ${msg}`);

    const result = yield call(
      bleWriteCharacteristic.call, {
        deviceId: id,
        serviceUuid: GARAGE_SERVICE_UUID,
        characteristicUuid: GARAGE_DOOR_CHARACTERISTIC_UUID,
        message: msg
      });

    if(result.type === bleWriteCharacteristic.SUCCESS) {
      yield put(toggleDoor.success(result.payload));
    } else {
      yield put(toggleDoor.failure(result.payload));
    }
  } catch (error) {
    yield call(console.error, `toggleDoorWorker exception: ${error}`);
    yield put(toggleDoor.failure({ id, error }));
    yield call(console.log, error);
  }
}

function* removeDeviceWorker(action) {
  const device = action.payload;
  yield call(console.log,`removeDeviceWorker: ${device.id} - ${device.name}`);

  try {
    if(device && device.id) {
      yield put(bleDeviceDisconnect.request(device));
      yield call(AsyncStorage.removeItem, deviceKeyId(device.id));
      yield put(removeDevice.success(device));
    } else {
      yield put(removeDevice.failure('need a device id to remove'));
    }
    yield put(removeDevice.success(device));
  } catch (error) {
    yield call(console.error, `removeDeviceWorker: error`);
    yield put(removeDevice.failure('need a device id to remove'));
  }
}

export function* saga() {
  yield takeLatest(loadDevices.REQUEST, loadDevicesWorker);
  yield takeLatest(loadDevices.SUCCESS, connectLoadedDevicesWorker);
  yield takeLatest(saveDevice.REQUEST, saveDeviceWorker);
  yield takeLatest(removeDevice.REQUEST, removeDeviceWorker);

  // only allow door toggle once per second
  yield throttle(1000, toggleDoor.REQUEST, toggleDoorWorker);
}
