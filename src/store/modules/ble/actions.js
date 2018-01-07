import {createAction} from '../../createAction';

const ActionPrefix = 'jg/ble/';

export const bleToggleDoor = createAction(ActionPrefix + 'TOGGLE_DOOR');

export const bleStart = createAction(ActionPrefix + 'START');
export const bleStop = createAction(ActionPrefix + 'STOP');

export const bleUpdateState = createAction(ActionPrefix + 'UPDATE_STATE');

export const bleScanStart = createAction(ActionPrefix + 'SCAN_START');
export const bleScanStop = createAction(ActionPrefix + 'SCAN_STOP');

export const bleDeviceFound = createAction(ActionPrefix + 'DEVICE_FOUND');

export const bleDeviceConnect = createAction(ActionPrefix + 'DEVICE_CONNECT');
export const bleDeviceDisconnect = createAction(ActionPrefix + 'DEVICE_DISCONNECT');

export const bleDeviceGetServices = createAction(ActionPrefix + 'DEVICE_GET_SERVICES');

export const bleDeviceConnectKnown = createAction(ActionPrefix + 'DEVICE_CONNECT_KNOWN');
export const bleDeviceDisconnectKnown = createAction(ActionPrefix + 'DEVICE_CONNECT_KNOWN');

export const bleDeviceSignalStrength = createAction(ActionPrefix + 'DEVICE_SIGNAL_STRENGTH');
