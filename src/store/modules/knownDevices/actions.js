import { ActionCreator } from '../../ActionCreator';

const ActionPrefix = 'jg/knownDevices/';

export const saveDevice = new ActionCreator(ActionPrefix, 'SAVE_DEVICE');
export const loadDevices = new ActionCreator(ActionPrefix, 'LOAD_DEVICES');
export const removeDevice = new ActionCreator(ActionPrefix, 'REMOVE_DEVICE');

export const toggleDoor = new ActionCreator(ActionPrefix, 'TOGGLE_DOOR');
