// @flow
import { ActionCreator } from '../ActionCreator';
import type { BleDevice } from '../ble';

const ActionPrefix = 'jg/knownDevices/';

export type LoadDevicesPayload = {
  devices: Array<BleDevice>,
  error?: any;
};

export type RemoveDevicePayload = {
  device: BleDevice,
};

export type SaveDevicePayload = {
  device: BleDevice,
};

export type ToggleDoorPayload = {
  device: BleDevice,
  errorMessage?: string,
};

const saveDevice: ActionCreator<SaveDevicePayload> = new ActionCreator(ActionPrefix, 'SAVE_DEVICE');
const loadDevices: ActionCreator<LoadDevicesPayload> = new ActionCreator(ActionPrefix, 'LOAD_DEVICES');
const removeDevice: ActionCreator<RemoveDevicePayload> = new ActionCreator(ActionPrefix, 'REMOVE_DEVICE');
const toggleDoor: ActionCreator<ToggleDoorPayload> = new ActionCreator(ActionPrefix, 'TOGGLE_DOOR');

export {
  saveDevice,
  loadDevices,
  removeDevice,
  toggleDoor,
};
