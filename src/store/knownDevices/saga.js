// @flow
import {takeLatest, all, call, put, throttle, takeEvery, select} from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import { bleDeviceDisconnect, bleDeviceConnect, bleWriteCharacteristic, bleDeviceConnectKnown} from '../ble';
import { loadDevices, saveDevice, removeDevice, toggleDoor } from './index';
import { createMsg } from './messages';
import type {
  Action,
  BleDevice,
  LoadDevicesPayload,
  RemoveDevicePayload
} from '../index';
import type {SaveDevicePayload, ToggleDoorPayload} from './actions';

const GARAGE_SERVICE_UUID = "321CCACA-29A6-4D46-B2DB-9B5639948751";
const GARAGE_DOOR_CHARACTERISTIC_UUID = "D7C7B570-EEDA-11E7-BD5D-FB4762172F1A";

const COMMAND_TOGGLE_DOOR = 0x01;

const deviceKey = 'DEVICE:';
const deviceKeyId = id => `${deviceKey}${id}`;

const getKnownDevices = state => state.knownDevices.devices.toList().toJS();

function* loadDevicesWorker(): Generator<*,*,*> {
  const keysResult = yield call(AsyncStorage.getAllKeys);
  try {
    const deviceKeys = keysResult.filter(key => key.startsWith(deviceKey));
    const devices: Array<BleDevice> = [];
    if(deviceKeys.length > 0) {
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
    yield put(loadDevices.success({ devices }));

  } catch (error){
    yield call(console.log, `loadDevicesWorks error: ${error}`);
    yield put(loadDevices.failure({
      devices: [],
      error
    }));
  }
}

function* connectDevices(devices: Array<BleDevice>): Generator<*,*,*> {
  try {
    yield all(devices.map(device => put(bleDeviceConnect.request({device}))));
  } catch (error) {
    yield call(console.log, `connectDevices error: ${error}`);
  }
}

function* connectLoadedDevicesWorker(action: Action<LoadDevicesPayload>): Generator<*,*,*> {
  const {devices} = action.payload;
  yield call(connectDevices, devices);
}

function* connectKnownDevicesWorker(): Generator<*,*,*> {
  const devices = yield select(getKnownDevices);
  yield call(connectDevices, devices);
  yield put(bleDeviceConnectKnown.success());
}


function* saveDeviceWorker(action: Action<SaveDevicePayload>): Generator<*,*,*> {
  const {device} = action.payload;
  yield call(console.log, `saveDeviceWorker: ${JSON.stringify(action.payload)}`);

  try {
    // validate the device
    if (device.id && device.name && device.key) {
      console.log('saveDeviceWorker: Device is valid');
      // add to persistent store
      yield call(AsyncStorage.setItem, deviceKeyId(device.id), JSON.stringify(device));
      console.log('saveDeviceWorker: AsyncStorage success');
      yield put(saveDevice.success({device}));
    } else {
      console.log('saveDeviceWorker: invalid device, must have id, name and key');
      yield put(saveDevice.failure({device}));
    }
  } catch (error) {
    yield call(console.error, `saveDeviceWorker: ${JSON.stringify(error)}`);
    yield put(saveDevice.failure({device, error}));
  }
}

function* toggleDoorWorker(action: Action<ToggleDoorPayload>): Generator<*,*,*> {
  const { device } = action.payload;
  try {
    // TODO: get a serial number
    // TODO: manage rolling counter
    // TODO: create a list of commands
    const msg = createMsg(4294967295, 1024, COMMAND_TOGGLE_DOOR);
    // console.log(`toggleDoorWorker: ${msg}`);

    const result = yield call(
      bleWriteCharacteristic.call, {
        deviceId: device.id,
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
    yield put(toggleDoor.failure({
      device,
      errorMessage: error,
    }));
  }
}

function* removeDeviceWorker(action: Action<RemoveDevicePayload>): Generator<*,*,*> {
  const {device} = action.payload;
  yield call(console.log,`removeDeviceWorker: ${device.id} - ${device.name ? device.name : ''}`);

  try {
    if(device && device.id) {
      yield put(bleDeviceDisconnect.request({device}));
      yield call(AsyncStorage.removeItem, deviceKeyId(device.id));
      yield put(removeDevice.success({ device }));
    } else {
      yield put(removeDevice.failure({
        device,
        errorMessage: 'need a device id to remove'
      }));
    }
    yield put(removeDevice.success({ device }));
  } catch (error) {
    yield call(console.error, `removeDeviceWorker error: ${error}`);
    yield put(removeDevice.failure({
      device,
      errorMessage: 'need a device id to remove'
    }));
  }
}

export function* saga(): Generator<*,*,*> {
  yield takeLatest(loadDevices.REQUEST, loadDevicesWorker);

  yield takeLatest(loadDevices.SUCCESS, connectLoadedDevicesWorker);

  // connect known devices
  yield takeLatest(bleDeviceConnectKnown.REQUEST, connectKnownDevicesWorker);

  yield takeLatest(saveDevice.REQUEST, saveDeviceWorker);
  yield takeLatest(removeDevice.REQUEST, removeDeviceWorker);
  // only allow door toggle once per second
  yield throttle(1000, toggleDoor.REQUEST, toggleDoorWorker);
}
