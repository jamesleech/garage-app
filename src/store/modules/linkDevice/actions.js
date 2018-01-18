// @flow
import { ActionCreator } from '../../ActionCreator';
import type { BleDevice } from '../ble/actions';

const ActionPrefix = 'jg/linkDevice/';

export type StartLinkDevicePayload = {
  device: BleDevice,
};

export type LinkDevicePayload = {
  device: BleDevice;
};

export const startLinkDevice: ActionCreator<StartLinkDevicePayload> = new ActionCreator(ActionPrefix, 'START_LINK_DEVICE');
export const linkDevice: ActionCreator<LinkDevicePayload> = new ActionCreator(ActionPrefix, 'LINK_DEVICE');
