// @flow
import { combineReducers } from 'redux';
import {
  navReducer,
  splashReducer,
  signInReducer,
  bleReducer,
  linkDeviceReducer,
  knownDevicesReducer,
} from './index';

export const getRootReducer = () => combineReducers({
  nav: navReducer,
  splash: splashReducer,
  signIn: signInReducer,
  ble: bleReducer,
  linkDevice: linkDeviceReducer,
  knownDevices: knownDevicesReducer,
});
