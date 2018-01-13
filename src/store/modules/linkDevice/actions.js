import { ActionCreator } from '../../ActionCreator';

const ActionPrefix = 'jg/linkDevice/';

export const startLinkDevice = new ActionCreator(ActionPrefix, 'START_LINK_DEVICE');
export const linkDevice = new ActionCreator(ActionPrefix, 'LINK_DEVICE');
