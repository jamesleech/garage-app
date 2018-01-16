// @flow
import { ActionCreator } from '../../ActionCreator';

const ActionPrefix = 'jg/ble/';

export type BleDevice = {
  +id: string,
  name?: string,
  rssi?: string,
}

export type bleUpdateStatePayload = {};
export type bleScanStartPayload = {};
export type bleScanStopPayload = {};
export type bleStartPayload = {};
export type bleStopPayload = {};

export type bleDeviceFoundPayload = {
  device: BleDevice,
};
export type bleDeviceConnectPayload = {
  device: BleDevice,
};
export type bleDeviceDisconnectPayload = {
  device: BleDevice,
  errorMessage: string,
};
export type bleDeviceSignalStrengthPayload = {
  device: BleDevice,
};

export const bleStart: ActionCreator<bleStartPayload> = new ActionCreator(ActionPrefix, 'START');
export const bleStop: ActionCreator<bleStopPayload> = new ActionCreator(ActionPrefix, 'STOP');

export const bleUpdateState: ActionCreator<bleUpdateStatePayload> = new ActionCreator(ActionPrefix, 'UPDATE_STATE');

export const bleScanStart = new ActionCreator(ActionPrefix, 'SCAN_START');
export const bleScanStop = new ActionCreator(ActionPrefix, 'SCAN_STOP');

export const bleDeviceFound = new ActionCreator(ActionPrefix, 'DEVICE_FOUND');

export const bleDeviceConnect: ActionCreator<bleDeviceConnectPayload> = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT');
export const bleDeviceDisconnect: ActionCreator<bleDeviceDisconnectPayload> = new ActionCreator(ActionPrefix, 'DEVICE_DISCONNECT');

export const bleDeviceGetServices = new ActionCreator(ActionPrefix, 'DEVICE_GET_SERVICES');

export const bleDeviceConnectKnown = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT_KNOWN');
export const bleDeviceDisconnectKnown = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT_KNOWN');

export const bleDeviceSignalStrength: ActionCreator<bleDeviceSignalStrengthPayload> = new ActionCreator(ActionPrefix, 'DEVICE_SIGNAL_STRENGTH');

export const bleWriteCharacteristic = new ActionCreator(ActionPrefix, 'WRITE_CHAR');


