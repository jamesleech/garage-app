import { combineReducers } from 'redux';
import { splashReducer } from './splash';
import { signInReducer } from './signIn';
import { navReducer } from './navigation';
import { bleReducer } from './ble';
import { linkDeviceReducer } from './linkDevice';
import {knownDevicesReducer} from './knownDevices';

export const getRootReducer = () => combineReducers({
  nav: navReducer,
  splash: splashReducer,
  signIn: signInReducer,
  ble: bleReducer,
  linkDevice: linkDeviceReducer,
  knownDevices: knownDevicesReducer,
});
