import { createAction } from '../../createAction';

const ActionPrefix = 'jg/linkDevice/';

export const linkDevice = createAction(ActionPrefix + 'LINK_DEVICE');
export const getDeviceKey = createAction(ActionPrefix + 'GET_DEVICE_KEY');
