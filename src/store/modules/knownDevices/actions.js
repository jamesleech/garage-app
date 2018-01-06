import { createAction } from '../../createAction';

const ActionPrefix = 'jg/knownDevices/';

export const saveDevice = createAction(ActionPrefix + 'SAVE_DEVICE');
export const loadDevices = createAction(ActionPrefix + 'LOAD_DEVICES');
export const loadedDevice = createAction(ActionPrefix + 'LOADED_DEVICE');
export const removeDevice = createAction(ActionPrefix + 'REMOVE_DEVICE');
