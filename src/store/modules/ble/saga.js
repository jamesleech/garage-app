import { channel } from 'redux-saga';
import {
  fork,
  call,
  put,
  take,
  takeEvery,
  select,
} from 'redux-saga/effects';
import {
  bleStart,
  bleStop,
  bleScanStart,
  bleScanStop,
  bleUpdateState, bleDeviceConnect,
} from './actions';
import { BleWrapper } from './BleWrapper';

const GARAGE_SERVICE_UUIDS = ["321CCACA-29A6-4D46-B2DB-9B5639948751"];

const getBleState = state => state.ble.on;
const getKnownDevices = state => state.ble.knownDevices;

// pipe ble channel messages
// HACK? is there a better way?
function* handleFromBleChannel(channel) {
  while (true) {
    const action = yield take(channel);
    yield put(action);

    if(action.type !== 'jg/ble/DEVICE_FOUND_SUCCESS') {
      console.log(`handleFromBleChannel piping ${JSON.stringify(action)}`);
    }
  }
}

// start up bluetooth
function* startBluetoothSaga(bleWrapper) {
  try {
    // start bluetooth
    yield call(bleWrapper.start);
    yield put(bleStart.success());
  } catch (error) {
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
      console.log(`scanningWorker: starting scanning`);
      yield call(bleWrapper.startScan, GARAGE_SERVICE_UUIDS, 10); // returns immediately
      console.log(`scanningWorker: started scanning for 5 seconds...`);
      // let the scanning run until a scan stop request or timed out
      const action = yield take([bleScanStop.REQUEST, bleScanStop.SUCCESS]);
      yield call(console.log, `scanningSaga: took action ${action}`);
      // if a stop request, cancel the scanning task.
      if(action.type === bleScanStop.REQUEST) {
        yield call(console.log, 'scanningSaga: attempting to cancel scanningTask');
        yield call(bleWrapper.stopScan);
        yield call(console.log, 'scanningSaga: cancelled scanningTask');
        yield put(bleScanStop.success());
      }
    }
  }
}

// inspect a device's details
function* inspectDeviceSaga(bleWrapper) {

}

function* connectDevice(bleWrapper, action) {
  const { id } = action.payload;
  yield console.log(`connectDevice ${JSON.stringify(id)}`);
  // yield call(bleWrapper.connect, id);
}

function* connectKnownDevices() {
  // after every start
  while(true) {
    const { payload } = yield take(bleUpdateState.SUCCESS);
    if(payload === 'on') { //TODO: remove magic string
      yield call(console.log, 'connectKnownDevices: try to connect all known devices...');
      const devices = yield select(getKnownDevices);
      for (let device of devices.valueSeq()) {
        yield put(bleDeviceConnect.request( { id: device.get('id') }));
      }
    }
  }
}

export function* saga() {
  // create a channel onto which the bleWrapper will emit actions
  const fromBleChannel = yield call(channel);
  yield fork(handleFromBleChannel, fromBleChannel);

  const bleWrapper = new BleWrapper(fromBleChannel);

  yield fork(scanningSaga, bleWrapper);
  yield fork(inspectDeviceSaga, bleWrapper);
  yield fork(connectKnownDevices);
  yield takeEvery(bleDeviceConnect.REQUEST, connectDevice, bleWrapper);

  // finally start bluetooth
  yield fork(stopBluetoothSaga, bleWrapper);
  yield fork(startBluetoothSaga, bleWrapper, fromBleChannel);
}
