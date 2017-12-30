import {createAction} from '../../createAction';

const ActionPrefix = 'jg/ble/';


export const bleStart = createAction(ActionPrefix + 'START');
export const bleStop = createAction(ActionPrefix + 'STOP');

export const bleUpdateState = createAction(ActionPrefix + 'UPDATE_STATE');

export const bleScanStart = createAction(ActionPrefix + 'SCAN_START');
export const bleScanStop = createAction(ActionPrefix + 'SCAN_STOP');

export const bleDeviceFound = createAction(ActionPrefix + 'DEVICE_FOUND');
export const bleDeviceSelected = createAction(ActionPrefix + 'DEVICE_SELECTED');
export const bleDeviceConnected = createAction(ActionPrefix + 'DEVICE_CONNECTED');
export const bleDeviceDisconnected = createAction(ActionPrefix + 'DEVICE_DISCONNECTED');
