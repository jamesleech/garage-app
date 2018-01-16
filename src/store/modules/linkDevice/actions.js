// @flow
import { ActionCreator } from '../../ActionCreator';

const ActionPrefix = 'jg/linkDevice/';

export type StartLinkDevicePayload = {
  device: Map<string, *>,
};

export type LinkDevicePayload = {
  device: Map<string, *>,
};

export const startLinkDevice: ActionCreator<StartLinkDevicePayload> = new ActionCreator(ActionPrefix, 'START_LINK_DEVICE');
export const linkDevice: ActionCreator<LinkDevicePayload> = new ActionCreator(ActionPrefix, 'LINK_DEVICE');
