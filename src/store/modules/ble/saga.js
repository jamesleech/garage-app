import { channel } from 'redux-saga';
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
  bleDeviceGetServices,
  bleDeviceConnectKnown,
} from './actions';
import { BleWrapper } from './BleWrapper';
import { createCommand } from './commands';
import {NavigationActions} from 'react-navigation';

const GARAGE_SERVICE_UUIDS = "321CCACA-29A6-4D46-B2DB-9B5639948751";
const GARAGE_DOOR_CHARACTERISTIC_UUID = "D7C7B570-EEDA-11E7-BD5D-FB4762172F1A";

const getBleState = state => state.ble.on;
const getKnownDevices = state => state.ble.knownDevices;

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
  yield console.log(`connectDeviceWorker ${JSON.stringify(id)}`);
  try {
    yield call(bleWrapper.connect, id);
  } catch (error) {
    yield put(bleDeviceConnect.failure({ id, error }));
    yield call(console.log, error);
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
    yield put(bleDeviceGetServices.failure({ id, error }));
    yield call(console.log, error);
  }
}

function* updateStateWorker(action) {
  const { payload } = action;
  if(payload === 'on') { //TODO: remove magic string
    yield put(bleDeviceConnectKnown.request());
  }
}

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

function* linkDeviceNavigate(action) {
  yield put(NavigationActions.navigate({
    routeName: 'LinkDevice',
    params: {
      deviceId: action.payload.id,
    }
  }))
}

function* toggleDoorWorker(bleWrapper, action) {
  const { id } = action.payload;
  yield call(console.log, `toggleDoorWorker: ${id}`);

  try {

    //TODO: get a serial number
    //TODO: manage rolling counter
    //TODO: create a list of commands
    const command = createCommand(4294967295,1024,0x0A);

    yield call(
      bleWrapper.write,
      id,
      GARAGE_SERVICE_UUIDS,
      GARAGE_DOOR_CHARACTERISTIC_UUID,
      command
    );
    yield put(bleToggleDoor.success({ id }));
  } catch (error) {
    yield put(bleToggleDoor.failure({ id, error }));
    yield call(console.log, error);
  }
}

// ble saga
export function* saga() {
  // create a channel onto which the bleWrapper will emit actions
  const fromBleChannel = yield call(channel);
  yield fork(handleFromBleChannel, fromBleChannel);

  // pass the channel to the bleWrapper
  const bleWrapper = new BleWrapper(fromBleChannel);

  // setup listener sagas
  yield takeEvery(bleDeviceConnect.REQUEST, connectDeviceWorker, bleWrapper);
  yield takeEvery(bleDeviceConnect.SUCCESS, connectedDeviceWorker, bleWrapper);
  yield takeEvery(bleDeviceGetServices.REQUEST, getDeviceServicesWorker, bleWrapper);

  // connect known devices, every time bluetooth is turned on (at start up) and also every request
  yield takeLatest(bleDeviceConnectKnown.REQUEST, connectKnownDevicesWorker);
  yield takeLatest(bleUpdateState.SUCCESS, updateStateWorker);

  // only allow door toggle once per second
  yield throttle(1000, bleToggleDoor.REQUEST, toggleDoorWorker, bleWrapper);

  // fork saga's
  yield fork(scanningSaga, bleWrapper);

  // finally start bluetooth
  yield fork(stopBluetoothSaga, bleWrapper);
  yield fork(startBluetoothSaga, bleWrapper, fromBleChannel);
}
