import {Map} from "immutable";
import { bleDeviceConnect, bleDeviceDisconnect, bleUpdateState } from '../ble/actions';
import { loadDevices, saveDevice, removeDevice } from './index';
import { linkDevice } from '../linkDevice';

const initialState = {
  devices: Map(
    [
      // [
      //   '4C9AE077-E60A-9E90-7F09-C2064B7D36A5',
      //   Map([
      //     ['id', '4C9AE077-E60A-9E90-7F09-C2064B7D36A5'],
      //     ['name', '**GarageOpener**'],
      //     ['status', 'notConnected' ]
      //     ])
      // ],
      // [
      //   '1C9AE077-E60A-9E90-7F09-C2064B7D36A5',
      //   Map([
      //     ['id', '1C9AE077-E60A-9E90-7F09-C2064B7D36A5'],
      //     ['name', '**Dummy**'],
      //     ['status', 'notConnected' ]
      //   ])
      // ]
    ]),
};

const bleUpdateStateReducer = (state, payload) => {
  const on = payload === 'on'; //TODO: remove magic string

  let devices;
  if(!on) {
    devices = state.devices.map(device => device.setIn(['status'], 'notConnected'));
  } else {
    devices = state.devices;
  }

  return {
    ...state,
    on,
    devices
  };
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case bleUpdateState.SUCCESS:
      return bleUpdateStateReducer(state, action.payload);
    case bleDeviceConnect.REQUEST:
      return {
        ...state,
        devices: state.devices.setIn([action.payload.id, 'status'], 'connecting'),
      };
    case bleDeviceConnect.SUCCESS:
      return {
        ...state,
        devices: state.devices.setIn([action.payload.id, 'status'], 'connected'),
      };
    case bleDeviceConnect.FAILURE:
      return {
        ...state,
        devices: state.devices.setIn([action.payload.id, 'status'], 'notConnected'),
      };
    case bleDeviceDisconnect.SUCCESS:
      return {
        ...state,
        devices: state.devices.setIn([action.payload.id, 'status'], 'notConnected'),
      };
    case loadDevices.SUCCESS:
      const loadedDevices = Map(action.payload.map(device => [ device.id, device]));
      console.log(`reducer loadDevices.SUCCESS device: ${JSON.stringify(loadedDevices )}`);
      return {
        ...state,
        // devices: loadedDevices,
        devices: state.devices.merge(loadedDevices),
      };
    case linkDevice.SUCCESS:
      const linkedDevice = action.payload;
      console.log(`reducer linkDevice.SUCCESS device: ${JSON.stringify(linkedDevice)}`);
      return {
        ...state,
        devices: state.devices.set(linkedDevice.id, linkedDevice),
      };
    default:
      return state
  }
};
