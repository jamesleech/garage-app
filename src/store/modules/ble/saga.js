import { channel, delay } from 'redux-saga';
import {
  put,
  fork,
  call,
  take,
  select,
  throttle,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';
import {
  bleStop,
  bleStart,
  bleScanStop,
  bleScanStart,
  bleToggleDoor,
  bleUpdateState,
  bleDeviceConnect,
  bleDeviceDisconnect,
  bleDeviceGetServices,
  bleDeviceConnectKnown,
  bleDeviceSignalStrength, bleWriteCharacteristic,
} from './actions';
import { BleWrapper } from './BleWrapper';
import { createMsg } from '../knownDevices/messages';
import {NavigationActions} from 'react-navigation';
import {linkDevice} from '../linkDevice';

const getBleState = state => state.ble.on;
const getKnownDevices = state => state.knownDevices.devices;

// pipe ble channel messages
// HACK? is there a better way?
function* handleFromBleChannel(channel) {
  while (true) {
    const action = yield take(channel);
    yield put(action);
    // if(action.type !== 'jg/ble/DEVICE_FOUND_SUCCESS') {
    //   console.log(`handleFromBleChannel piping ${JSON.stringify(action)}`);
    // }
  }
}

// start up bluetooth
function* startBluetoothSaga(bleWrapper) {
  try {
    // start bluetooth
    yield call(bleWrapper.start);
    yield put(bleStart.success());
  } catch (error) {
    yield call(console.error, `startBluetoothSaga exception: ${error}`);
    yield put(bleStart.failure(error));
  }
}

function* stopBluetoothSaga(bleWrapper) {
  // only stop after a successful start
  while(yield take(bleStart.SUCCESS)) {
    yield take(bleStop.REQUEST);
    yield call(bleWrapper.stop);
    yield put(bleStop.success());
  }
}

function* scanningSaga(bleWrapper) {
  //wait for a start scan request
  while (yield take(bleScanStart.REQUEST)) {
    const on = yield select(getBleState); // check to see if bluetooth is actually on

    if(!on) {
      yield put(bleScanStart.failure());
    } else {
      yield put(bleScanStart.success());
      // start scanning
      // yield call(bleWrapper.startScan, [GARAGE_SERVICE_UUIDS], 10); // returns immediately
      yield call(bleWrapper.startScan, null, 10); // returns immediately
      // let the scanning run until a scan stop request or timed out
      const action = yield take([bleScanStop.REQUEST, bleScanStop.SUCCESS]);
      // if a stop request, cancel the scanning task.
      if(action.type === bleScanStop.REQUEST) {
        yield call(bleWrapper.stopScan);
        yield put(bleScanStop.success());
      }
    }
  }
}

// device connect
function* connectDeviceWorker(bleWrapper, action) {
  const { id } = action.payload;
  try {
    const bleOn = yield select(getBleState);
    if(bleOn) {
      yield console.log(`connectDeviceWorker ${JSON.stringify(id)}`);
      yield call(bleWrapper.connect, id);
    } else {
      yield console.log(`connectDeviceWorker can NOT connect ${JSON.stringify(id)}, as bluetooth is not on.`);
    }
  } catch (error) {
    yield call(console.error, `connectDeviceWorker exception: ${error}`);
    yield put(bleDeviceConnect.failure({ id, error }));
  }
}

function* disconnectDeviceWorker(bleWrapper, action) {
  const { id } = action.payload;
  yield console.log(`disconnectDeviceWorker ${JSON.stringify(id)}`);

  try {
    yield call(bleWrapper.disconnect, id);
  } catch (error) {
    yield call(console.error, `disconnectDeviceWorker exception: ${error}`);
    yield put(bleDeviceDisconnect.failure({ id, error }));
  }
}

function* connectedDeviceWorker(bleWrapper, action) {
  const { id } = action.payload;
  yield console.log(`connectedDeviceWorker: ${JSON.stringify(id)}`);
  yield put(bleDeviceGetServices.request({ id }));
}

function* getDeviceServicesWorker(bleWrapper, action) {
  const { id } = action.payload;
  yield console.log(`getDeviceServicesWorker: ${JSON.stringify(id)}`);
  try {
    const services = yield call(bleWrapper.getServicesForDeviceId, id);
    yield call(console.log, `getDeviceServicesWorker: ${JSON.stringify(services)}`);
  } catch (error){
    yield call(console.error, `getDeviceServicesWorker exception: ${error}`);
    yield put(bleDeviceGetServices.failure({ id, error }));
  }
}

function* updateStateWorker(action) {
  const { payload } = action;
  if(payload === 'on') { //TODO: remove magic string
    yield put(bleDeviceConnectKnown.request());
  }
}

function* writeCharacteristic(bleWrapper, action) {
  const { deviceId, serviceUuid, characteristicUuid, message } = action.payload;
  try {
    yield call(
      bleWrapper.write,
      deviceId,
      serviceUuid,
      characteristicUuid,
      message
    );
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

function* connectKnownDevicesWorker() {
  yield call(console.log, 'connectKnownDevices: try to connect all known devices...');

  const devices = yield select(getKnownDevices);

  for (let device of devices.valueSeq()) {
    // if(device.get('status') !== 'connected') { //TODO: remove magic string
      yield put(bleDeviceConnect.request({id: device.get('id')}));
    // }
  }

  yield put(bleDeviceConnectKnown.success());
}

// ble saga
export function* saga() {
  // create a channel onto which the bleWrapper will emit actions
  const fromBleChannel = yield call(channel);
  yield fork(handleFromBleChannel, fromBleChannel);

  // pass the channel to the bleWrapper
  const bleWrapper = new BleWrapper(fromBleChannel);

  // setup listener sagas
  yield takeEvery([bleDeviceConnect.REQUEST, linkDevice.SUCCESS], connectDeviceWorker, bleWrapper);
  yield takeEvery(bleDeviceConnect.SUCCESS, connectedDeviceWorker, bleWrapper);
  yield takeEvery(bleDeviceGetServices.REQUEST, getDeviceServicesWorker, bleWrapper);
  yield takeEvery(bleDeviceDisconnect.REQUEST, disconnectDeviceWorker, bleWrapper);

  // connect known devices, every time bluetooth is turned on (at start up) and also every request to do so
  yield takeLatest(bleDeviceConnectKnown.REQUEST, connectKnownDevicesWorker);

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
