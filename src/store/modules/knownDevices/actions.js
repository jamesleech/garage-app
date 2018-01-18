// @flow
import { ActionCreator } from '../../ActionCreator';
import type { BleDevice } from '../ble';

const ActionPrefix = 'jg/knownDevices/';

export type LoadDevicesPayload = {
  devices: Array<BleDevice>
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

export const saveDevice: ActionCreator<SaveDevicePayload> = new ActionCreator(ActionPrefix, 'SAVE_DEVICE');
export const loadDevices: ActionCreator<LoadDevicesPayload> = new ActionCreator(ActionPrefix, 'LOAD_DEVICES');
export const removeDevice: ActionCreator<RemoveDevicePayload> = new ActionCreator(ActionPrefix, 'REMOVE_DEVICE');
export const toggleDoor: ActionCreator<ToggleDoorPayload> = new ActionCreator(ActionPrefix, 'TOGGLE_DOOR');
