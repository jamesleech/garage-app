// @flow
import { channel } from 'redux-saga';
import {
  put,
  fork,
  call,
  take,
  select,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {
  bleStop,
  bleStart,
  bleScanStop,
  bleScanStart,
  bleUpdateState,
  bleDeviceConnect,
  bleDeviceDisconnect,
  bleDeviceGetServices,
  bleDeviceConnectKnown,
  bleWriteCharacteristic,
} from './actions';
import { BleWrapper } from './BleWrapper';
import type { WriteCommand } from './BleWrapper';
import type { Action } from '../Action';
import type { LinkDevicePayload } from '../linkDevice/index';
import type {
  bleDeviceDisconnectPayload,
  bleDeviceConnectPayload,
  bleScanStopPayload,
  bleDeviceGetServicesPayload,
  bleUpdateStatePayload,
  bleWriteCharacteristicPayload,
} from './actions';

const getBleState = (state): boolean => state.ble.on;

// const GARAGE_SERVICE_UUIDS = "321CCACA-29A6-4D46-B2DB-9B5639948751";

// pipe ble channel messages
// HACK? is there a better way?
function* handleFromBleChannel(bleChannel): Generator<*,*,*> {
  while (true) {
    const action = yield take(bleChannel);
    yield put(action);
    // if(action.type !== 'jg/ble/DEVICE_FOUND_SUCCESS') {
    //   console.log(`handleFromBleChannel piping ${JSON.stringify(action)}`);
    // }
  }
}

// start up bluetooth
function* startBluetoothSaga(bleWrapper): Generator<*,*,*> {
  try {
    // start bluetooth
    yield call(bleWrapper.start);
    yield put(bleStart.success({}));
  } catch (error) {
    yield call(console.error, `startBluetoothSaga exception: ${error}`);
    yield put(bleStart.failure(error));
  }
}

function* stopBluetoothSaga(bleWrapper): Generator<*,*,*> {
  // only stop after a successful start
  while(yield take(bleStart.SUCCESS)) {
    yield take(bleStop.REQUEST);
    yield call(bleWrapper.stop);
    yield put(bleStop.success({}));
  }
}

function* scanningSaga(bleWrapper): Generator<*,*,*> {
  // wait for a start scan request
  while (yield take(bleScanStart.REQUEST)) {
    const on: boolean = yield select(getBleState); // check to see if bluetooth is actually on

    if(!on) {
      yield put(bleScanStart.failure());
    } else {
      yield put(bleScanStart.success());
      // start scanning
      // yield call(bleWrapper.startScan, [GARAGE_SERVICE_UUIDS], 10); // returns immediately
      yield call(bleWrapper.startScan, null, 10); // returns immediately
      // let the scanning run until a scan stop request or timed out
      const action: Action<bleScanStopPayload> = yield take([bleScanStop.REQUEST, bleScanStop.SUCCESS]);
      // if a stop request, cancel the scanning task.
      if(action.type === bleScanStop.REQUEST) {
        yield call(bleWrapper.stopScan);
        yield put(bleScanStop.success());
      }
    }
  }
}

// device connect
function* connectDeviceWorker(bleWrapper, action: Action<LinkDevicePayload | bleDeviceConnectPayload>): Generator<*,*,*> {
  const { device } = action.payload;
  yield call(console.log, `connectDeviceWorker: ${JSON.stringify(device)}`);
  try {
    const bleOn = yield select(getBleState);
    if(bleOn) {
      yield call(console.log,`connectDeviceWorker bluetooth on attempting to connect.`);
      yield call(bleWrapper.connect, device.id);
    } else {
      yield call(console.log,`connectDeviceWorker can NOT connect ${JSON.stringify(device)}, as bluetooth is not on.`);
    }
  } catch (error) {
    yield call(console.error, `connectDeviceWorker exception: ${error}`);
    yield put(bleDeviceConnect.failure({ device, error }));
  }
}

function* connectedDeviceWorker(bleWrapper, action: Action<bleDeviceConnectPayload>): Generator<*,*,*> {
  const { device } = action.payload;
  yield call(console.log, `connectedDeviceWorker: ${JSON.stringify(device)}`);
  // only get services if they have not been previously stored / loaded.
  if(!device.services) {
    yield call(console.log, `connectedDeviceWorker calling bleDeviceGetServies.request`);
    yield put(bleDeviceGetServices.request({device}));
  }
}

function* disconnectDeviceWorker(bleWrapper, action: Action<bleDeviceDisconnectPayload>): Generator<*,*,*> {
  const { device } = action.payload;
  yield call(console.log, `disconnectDeviceWorker ${JSON.stringify(device)}`);

  try {
    yield call(bleWrapper.disconnect, device.id);
  } catch (error) {
    yield call(console.error, `disconnectDeviceWorker exception: ${error}`);
    yield put(bleDeviceDisconnect.failure({
      device,
      errorMessage: JSON.stringify(error),
    }));
  }
}

function* getDeviceServicesWorker(bleWrapper, action: Action<bleDeviceGetServicesPayload>): Generator<*,*,*> {
  const { device } = action.payload;
  try {
    const services = yield call(bleWrapper.getServicesForDeviceId, device.id);
    yield call(console.log, `getDeviceServicesWorker: ${JSON.stringify(services)}`);
    if(services){
      const deviceWithServices = {...device, ...services};
      yield put(bleDeviceGetServices.success({ device: deviceWithServices }));
    } else {
      yield put(bleDeviceGetServices.failure({ device }));
    }
  } catch (error){
    yield call(console.error, `getDeviceServicesWorker exception: ${error}`);
    yield put(bleDeviceGetServices.failure({ device, error }));
  }
}

function* updateStateWorker(action: Action<bleUpdateStatePayload>): Generator<*,*,*> {
  const { state } = action.payload;
  if(state === 'on') { // TODO: remove magic string
    yield put(bleDeviceConnectKnown.request());
  }
}

function* writeCharacteristic(bleWrapper, action: Action<bleWriteCharacteristicPayload>): Generator<*,*,*> {
  const { deviceId, serviceUuid, characteristicUuid, message } = action.payload;
  try {
    const command: WriteCommand = {
      id: deviceId,
      serviceUuid,
      characteristicUuid,
      data: message ? (message: Array<number>) : [],
    };

    yield call(bleWrapper.write, command);
    yield put(bleWriteCharacteristic.success({ deviceId, serviceUuid, characteristicUuid }));
  } catch (error) {
    yield call(console.error, `writeCharacteristic exception: ${error}`);
    yield put(bleWriteCharacteristic.failure({ deviceId, serviceUuid, characteristicUuid, error }));
    yield call(console.log, error);
  }
}

// function* getDeviceSignalStrengthWorker(bleWrapper, action) {
//   try {
//     const deviceId = action.payload.id;
//     const rssi = yield call(bleWrapper.getSignalStrength, deviceId);
//     yield call(console.log, `getDeviceSignalStrengthWorker: signal strength for ${deviceId} is ${rssi}`);
//     yield put(bleDeviceSignalStrength.success( { id: deviceId, rssi }));
//   } catch (error){
//     yield call(console.error, `getDeviceSignalStrengthWorker exception: ${error}`);
//   }
// }
//
// function* updateDeviceSignalStrengthSaga() {
//   while(true) {
//     try {
//       yield delay(1000);
//       const state = yield select(getBleState);
//       if(state) {
//         const devices = yield select(getKnownDevices);
//         const connectedDeviceIds = devices.filter(d => d.get('status') === 'connected').keys(); //TODO: remove magic string
//         for (let id of connectedDeviceIds) {
//           console.log(`updateDeviceSignalStrengthSaga: ${JSON.stringify(id)}`);
//           yield put(bleDeviceSignalStrength.request({ id }));
//         }
//       }
//     } catch (error){
//       yield call(console.error, `updateDeviceSignalStrengthSaga exception: ${error}`);
//     }
//   }
// }

// ble saga
export function* saga(): Generator<*,*,*> {
  // create a channel onto which the bleWrapper will emit actions
  const fromBleChannel = yield call(channel);
  yield fork(handleFromBleChannel, fromBleChannel);

  // pass the channel to the bleWrapper
  const bleWrapper = new BleWrapper(fromBleChannel);

  // setup listener sagas
  yield takeEvery(bleDeviceConnect.REQUEST, connectDeviceWorker, bleWrapper);
  yield takeEvery(bleDeviceConnect.SUCCESS, connectedDeviceWorker, bleWrapper);

  yield takeEvery([bleDeviceGetServices.REQUEST,bleDeviceConnect.SUCCESS], getDeviceServicesWorker, bleWrapper);
  yield takeEvery(bleDeviceDisconnect.REQUEST, disconnectDeviceWorker, bleWrapper);

  // handle bluetooth state changes
  yield takeLatest(bleUpdateState.SUCCESS, updateStateWorker);

  // device interactions
  yield takeEvery(bleWriteCharacteristic.REQUEST, writeCharacteristic, bleWrapper);

  // fork saga's
  yield fork(scanningSaga, bleWrapper);

  // finally start bluetooth
  yield fork(stopBluetoothSaga, bleWrapper);
  yield fork(startBluetoothSaga, bleWrapper, fromBleChannel);

  // keep signal strength updated
  // yield takeEvery(bleDeviceSignalStrength.REQUEST, getDeviceSignalStrengthWorker, bleWrapper);
  // yield fork(updateDeviceSignalStrengthSaga);
}
