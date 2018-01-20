// @flow
import { ActionCreator } from '../ActionCreator';

const ActionPrefix = 'jg/ble/';

export type BleDevice = {
  +id: string,
  name?: string,
  status?: string,
  rssi?: string,
  key?: string,
  alias?: string,
}

export type bleUpdateStatePayload = {
  state: string;
};

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
  errorMessage?: string,
};
export type bleDeviceGetServicesPayload = {
  device: BleDevice,
  services?: Array<any>; // TODO: define this
}

export type bleDeviceSignalStrengthPayload = {
  // device: BleDevice,
};

const bleStart: ActionCreator<bleStartPayload> = new ActionCreator(ActionPrefix, 'START');
const bleStop: ActionCreator<bleStopPayload> = new ActionCreator(ActionPrefix, 'STOP');

const bleUpdateState: ActionCreator<bleUpdateStatePayload> = new ActionCreator(ActionPrefix, 'UPDATE_STATE');

const bleScanStart = new ActionCreator(ActionPrefix, 'SCAN_START');
const bleScanStop = new ActionCreator(ActionPrefix, 'SCAN_STOP');

const bleDeviceFound = new ActionCreator(ActionPrefix, 'DEVICE_FOUND');

const bleDeviceConnect: ActionCreator<bleDeviceConnectPayload> = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT');
const bleDeviceDisconnect: ActionCreator<bleDeviceDisconnectPayload> = new ActionCreator(ActionPrefix, 'DEVICE_DISCONNECT');

const bleDeviceGetServices:ActionCreator<bleDeviceGetServicesPayload> = new ActionCreator(ActionPrefix, 'DEVICE_GET_SERVICES');

const bleDeviceConnectKnown = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT_KNOWN');
const bleDeviceDisconnectKnown = new ActionCreator(ActionPrefix, 'DEVICE_CONNECT_KNOWN');

const bleDeviceSignalStrength: ActionCreator<bleDeviceSignalStrengthPayload> = new ActionCreator(ActionPrefix, 'DEVICE_SIGNAL_STRENGTH');

const bleWriteCharacteristic = new ActionCreator(ActionPrefix, 'WRITE_CHAR');

export {
  bleStart,
  bleStop,
  bleUpdateState,
  bleScanStart,
  bleScanStop,
  bleDeviceFound,
  bleDeviceConnect,
  bleDeviceDisconnect,
  bleDeviceGetServices,
  bleDeviceConnectKnown,
  bleDeviceDisconnectKnown,
  bleDeviceSignalStrength,
  bleWriteCharacteristic,
};
