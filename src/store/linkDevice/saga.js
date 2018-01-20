// @flow
import { NavigationActions } from 'react-navigation';
import { takeLatest, call, put } from 'redux-saga/effects';
import { linkDevice, startLinkDevice } from './index';
import { saveDevice } from '../knownDevices';
import { bleScanStop } from '../ble';
import type { StartLinkDevicePayload, LinkDevicePayload } from './actions';
import type { Action } from '../Action';

function* linkDeviceWorker(action: Action<StartLinkDevicePayload>): Generator<*,*,*> {
  yield put(bleScanStop.request());
  const { device } = action.payload;
  yield call(console.log,`linkDeviceWorker ${JSON.stringify(device)}`);

  device.status = 'notConnected';
  // TODO: navigate to screen to get secret key from user

  yield put(NavigationActions.navigate({
    routeName: 'LinkDevice',
    params: {
      device,
    }
  }));
}

function* requestSaveDeviceWorker(action: Action<LinkDevicePayload>): Generator<*,*,*> {
  const { device } = action.payload;
  // yield call(console.log,`requestSaveDeviceWorker ${device.id} - ${device.name}`);

  try {
    // add to persistent store
    yield call(console.log, `requestSaveDeviceWorker.saveDevice: ${JSON.stringify(device)}`);
    const saveResult = yield call(saveDevice.call, {device});
    yield call(console.log, `requestSaveDeviceWorker - saveResult: ${JSON.stringify(saveResult)}`);
    yield put(linkDevice.success({ device }));
    yield put(NavigationActions.back());
  } catch (error) {
    yield call(console.log, `requestSaveDeviceWorker error: ${JSON.stringify(error)}`);
    yield put(linkDevice.failure({ device, error }));
  }
}

export function* saga(): Generator<*,*,*> {
  yield takeLatest(startLinkDevice.REQUEST, linkDeviceWorker);
  yield takeLatest(linkDevice.REQUEST, requestSaveDeviceWorker);
}
