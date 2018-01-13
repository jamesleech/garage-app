import { ActionCreator } from '../../ActionCreator';

const ActionPrefix = 'jg/ble/';

export const bleStart = new ActionCreator(ActionPrefix, 'START');
export const bleStop = new ActionCreator(ActionPrefix, 'STOP');

export const bleUpdateState = new ActionCreator(ActionPrefix, 'UPDATE_STATE');

export const bleScanStart = new ActionCreator(ActionPrefix, 'SCAN_START');
export const bleScanStop = new ActionCreator(ActionPrefix, 'SCAN_STOP');

export const bleDeviceFound = new ActionCreator(ActionPrefix, 'DEVICE_FOUND');

export const bleDeviceConnect = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT');
export const bleDeviceDisconnect = new ActionCreator(ActionPrefix, 'DEVICE_DISCONNECT');

export const bleDeviceGetServices = new ActionCreator(ActionPrefix, 'DEVICE_GET_SERVICES');

export const bleDeviceConnectKnown = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT_KNOWN');
export const bleDeviceDisconnectKnown = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT_KNOWN');

export const bleDeviceSignalStrength = new ActionCreator(ActionPrefix, 'DEVICE_SIGNAL_STRENGTH');

export const bleWriteCharacteristic = new ActionCreator(ActionPrefix, 'WRITE_CHAR');
