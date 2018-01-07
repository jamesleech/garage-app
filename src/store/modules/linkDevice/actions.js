import { createAction } from '../../createAction';

const ActionPrefix = 'jg/linkDevice/';

export const startLinkDevice = createAction(ActionPrefix + 'START_LINK_DEVICE');
export const linkDevice = createAction(ActionPrefix + 'LINK_DEVICE');
