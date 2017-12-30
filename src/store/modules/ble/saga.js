import { runSaga, channel } from 'redux-saga';
import {
  fork,
  call,
  put,
  take,
  takeLatest,
  select,
  cancel,
  cancelled
} from 'redux-saga/effects';
import {
  bleStart,
  bleStop,
  bleScanStart,
  bleScanStop,
  bleDeviceFound,
  bleDeviceSelected,
} from './actions';
import { BleWrapper } from './BleWrapper';

const GARAGE_SERVICE_UUIDS = ["11968E9E-D881-4502-A2ED-50FBC71968A0"];

const getBleState = ( state ) => state.ble.on;

// pipe ble channel messages into the root saga
function* handleFromBleChannel(channel) {
  while (true) {
    const action = yield take(channel);
    if(action.type !== 'jg/ble/DEVICE_FOUND_SUCCESS') {
      console.log(`handleFromBleChannel piping ${JSON.stringify(action)}`);
    }
    yield put(action);
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
    const on = yield select(getBleState);

    if(on) {
      yield put(bleScanStart.success());
      // start scanning
      console.log(`scanningWorker: starting scanning`);
      yield call(bleWrapper.startScan, GARAGE_SERVICE_UUIDS, 5); // returns immediately
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
    } else {
      yield put(bleScanStart.failure());
    }
  }
}

// inspect a devices details
function* inspectDeviceSaga(bleWrapper) {

}

export function* saga() {
  // create a channel onto which the bleWrapper will emit actions
  const fromBleChannel = yield call(channel);
  yield fork(handleFromBleChannel, fromBleChannel);

  const bleWrapper = new BleWrapper(fromBleChannel);

  yield fork(scanningSaga, bleWrapper);
  yield fork(inspectDeviceSaga, bleWrapper);
  //...

  // finally start bluetooth
  yield fork(stopBluetoothSaga, bleWrapper);
  yield fork(startBluetoothSaga, bleWrapper, fromBleChannel);
}
