// @flow
import { ActionCreator } from '../ActionCreator';
import type { BleDevice } from '../ble/actions';

const ActionPrefix = 'jg/linkDevice/';

export type StartLinkDevicePayload = {
  device: BleDevice,
};

export type LinkDevicePayload = {
  device: BleDevice;
};

const startLinkDevice: ActionCreator<StartLinkDevicePayload> = new ActionCreator(ActionPrefix, 'START_LINK_DEVICE');
const linkDevice: ActionCreator<LinkDevicePayload> = new ActionCreator(ActionPrefix, 'LINK_DEVICE');

export {
  startLinkDevice,
  linkDevice
};
