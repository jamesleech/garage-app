import {Map} from "immutable";
import {bleDeviceConnect, bleDeviceDisconnect, bleDeviceSignalStrength, bleUpdateState} from '../ble/actions';
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

  try {
    let devices;
    if (!on) { //bluetooth not on, set all devices as not connected
      devices = state.devices.map(device => device.setIn(['status'], 'notConnected'));
    } else {
      devices = state.devices;
    }
    return {
      ...state,
      devices
    };
  } catch (error)  {
    console.error(`bleUpdateStateReducer: ${error}`);
    return state;
  }
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
    case bleDeviceDisconnect.REQUEST:
      const { disconnectingDevice } = action.payload;
      if(disconnectingDevice && state.devices.has(disconnectingDevice.id)) {
        return {
          ...state,
          devices: state.devices.setIn([disconnectingDevice.id, 'status'], 'disconnecting'),
        };
      } else {
        return state;
      }
    case bleDeviceDisconnect.SUCCESS:
      const { disconnectedDevice } = action.payload;
      // need to test if the device is still a known device, could have just been removed and disconnected.
      if(disconnectedDevice && state.devices.has(disconnectedDevice.id)) {
        return {
          ...state,
          devices: state.devices.setIn([disconnectedDevice.id, 'status'], 'notConnected'),
        };
      } else {
        return state;
      }
    case bleDeviceSignalStrength.SUCCESS:
      return {
        ...state,
        devices: state.devices.setIn([action.payload.id, 'rssi'], action.payload.rssi),
      };
    case loadDevices.SUCCESS:
      const devices = Map(action.payload.map((item) => [ item.id, Map(item) ]));
      return {
        ...state,
        devices: state.devices.merge(devices),
      };
    case linkDevice.SUCCESS:
      const linkedDevice = Map(action.payload);
      return {
        ...state,
        devices: state.devices.set(linkedDevice.get('id'), linkedDevice),
      };
    case removeDevice.SUCCESS:
      const removeDeviceId = action.payload.id;
      return {
        ...state,
        devices: state.devices.delete(removeDeviceId),
      };
    default:
      return state
  }
};
