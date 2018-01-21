// @flow
import { NavigationActions } from 'react-navigation';
import { takeLatest, call, put } from 'redux-saga/effects';
import type { Action } from '../Action';
import {
  linkDevice,
  startLinkDevice,
  saveDevice,
  bleScanStop,
  bleDeviceConnect,
  bleDeviceGetServices,
} from '../index';
import type {
  StartLinkDevicePayload,
  LinkDevicePayload,
  bleDeviceGetServicesPayload
} from '../index';

function* linkDeviceWorker(action: Action<StartLinkDevicePayload>): Generator<*,*,*> {
  yield put(bleScanStop.request());
  const { device } = action.payload;
  yield call(console.log,`linkDeviceWorker ${JSON.stringify(device)}`);

  yield put(bleDeviceConnect.request({device}));

  // navigate to screen to get secret key from user
  yield put(NavigationActions.navigate({
    routeName: 'LinkDevice',
    params: {
      device,
    }
  }));
}

function* requestLinkDeviceWorker(action: Action<LinkDevicePayload>): Generator<*,*,*> {
  const { device } = action.payload;
  try {
    const result: Action<bleDeviceGetServicesPayload> = yield call(bleDeviceGetServices.call, {device});
    yield call(console.log, `requestLinkDeviceWorker: get services result ${JSON.stringify(result)}`);
    if(result.type === bleDeviceGetServices.SUCCESS) {
      const deviceWithServices = {
        ...device, ...result.payload.device
      };
      yield put(linkDevice.success({ device: deviceWithServices }));
    } else {
      yield put(linkDevice.success({ device }));
    }
  } catch (error) {
    yield call(console.log, `requestLinkDeviceWorker error: ${JSON.stringify(error)}`);
    yield put(linkDevice.failure({ device, error }));
  }
}

function* successLinkDeviceWorker(action: Action<LinkDevicePayload>): Generator<*,*,*> {
  const { device } = action.payload;
  // yield call(console.log,`requestSaveDeviceWorker ${device.id} - ${device.name}`);

  try {
    // add to persistent store
    yield call(console.log, `requestSaveDeviceWorker.saveDevice: ${JSON.stringify(device)}`);
    const saveResult = yield call(saveDevice.call, {device});
    yield call(console.log, `requestSaveDeviceWorker - saveResult: ${JSON.stringify(saveResult)}`);

    yield put(NavigationActions.back());
  } catch (error) {
    yield call(console.log, `requestSaveDeviceWorker error: ${JSON.stringify(error)}`);
    yield put(linkDevice.failure({ device, error }));
  }
}

export function* saga(): Generator<*,*,*> {
  yield takeLatest(startLinkDevice.REQUEST, linkDeviceWorker);
  yield takeLatest(linkDevice.REQUEST, requestLinkDeviceWorker);
  yield takeLatest(linkDevice.SUCCESS, successLinkDeviceWorker);
}
