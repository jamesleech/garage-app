// @flow
import { Map } from "immutable";
import type { Action } from '../Action';
import type {
  BleDevice,
  bleUpdateStatePayload,
  bleDeviceConnectPayload,
  bleDeviceGetServicesPayload,
  bleDeviceDisconnectPayload,
  bleDeviceSignalStrengthPayload,
  LinkDevicePayload,
} from '../index';
import {
  bleDeviceConnect,
  bleDeviceGetServices,
  bleDeviceDisconnect,
  bleUpdateState,
  linkDevice
} from '../index';

import type { RemoveDevicePayload, LoadDevicesPayload } from './index';
import { removeDevice, loadDevices } from './index';

type State = {
  +devices: Map<string, BleDevice>;
}

const initialState: State = {
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

export type Actions = Action<
  bleUpdateStatePayload | bleDeviceConnectPayload | bleDeviceGetServicesPayload | bleDeviceDisconnectPayload | bleDeviceSignalStrengthPayload
  | LinkDevicePayload | RemoveDevicePayload | LoadDevicesPayload>;

export const reducer = (state: State = initialState, action: Actions) => {
  switch (action.type) {
    case loadDevices.SUCCESS: {
      const { devices } = (action.payload: LoadDevicesPayload | any);
      const devicesMap = Map(devices.map((item) => [ item.id, item ]));
      return {
        ...state,
        devices: state.devices.merge(devicesMap),
      };
    }
    case linkDevice.SUCCESS: {
      const { device } = (action.payload: LinkDevicePayload | any);
      return {
        ...state,
        devices: state.devices.set(device.id, device),
      };
    }
    case bleUpdateState.SUCCESS: {
      const on = ((action.payload: bleUpdateStatePayload | any)=== 'on'); // TODO: remove magic string
      return {
        ...state,
        devices:
          !on
          ? state.devices.map(device => ({...device, status: 'notConnected'}))
          : state.devices
      };
    }
    case bleDeviceConnect.REQUEST: {
      const { device } = (action.payload: bleDeviceConnectPayload | any);
      const existing = state.devices.get(device.id);
      if(existing && existing.id) {
        return {
          ...state,
          devices: state.devices.set(device.id, {
            ...existing,
            status: 'connecting'
          }),
        };
      }
      return state;
    }
    case bleDeviceConnect.SUCCESS: {
      const { device } = (action.payload: bleDeviceConnectPayload | any);
      const existing = state.devices.get(device.id);
      if(existing && existing.id) {
        return {
          ...state,
          devices: state.devices.set(device.id, {
            ...existing,
            status: 'connected'
          }),
        };
      }
      return state;
    }
    case bleDeviceConnect.FAILURE: {
      const { device } = (action.payload: bleDeviceConnectPayload | any);
      const existing = state.devices.get(device.id);
      if(existing && existing.id) {
        return {
          ...state,
          devices: state.devices.set(device.id, {
            ...state.devices.get(device.id),
            status: 'notConnected'
          }),
        };
      }
      return state;
    }
    // case bleDeviceGetServices.SUCCESS: {
    //   const { device } = (action.payload: bleDeviceGetServicesPayload | any);
    //   const { existing } = state.devices.get(device.id);
    //   console.log(`knownDevices reducer: bleDeviceGetServices.SUCCESS: new ${JSON.stringify(device)}`);
    //   console.log(`knownDevices reducer: bleDeviceGetServices.SUCCESS: existing ${JSON.stringify(existing)}`);
    //   return {
    //     ...state,
    //     devices: state.devices.set(device.id, {
    //
    //     }),
    //   };
    // }
    case bleDeviceDisconnect.REQUEST: {
      const { device } = (action.payload: bleDeviceDisconnectPayload | any);
      if (device.id && state.devices.has(device.id)) {
        return {
          ...state,
          devices: state.devices.set(device.id, {
            ...state.devices.get(device.id),
            status: 'disconnecting'
          }),
        };
      }
      return state;
    }
    case bleDeviceDisconnect.SUCCESS: {
      const { device } = (action.payload: bleDeviceDisconnectPayload | any);
      // need to test if the device is still a known device, could have just been removed and disconnected.
      if (device.id && state.devices.has(device.id)) {
        return {
          ...state,
          devices: state.devices.set(device.id, {
            ...state.devices.get(device.id),
            status: 'notConnected'
          }),
        };
      }
      return state;
    }
    // case bleDeviceSignalStrength.SUCCESS: {
    //   const { device } = (action.payload: bleDeviceSignalStrengthPayload | any);
    //   return {
    //     ...state,
    //     devices: state.devices.setIn([device.id, 'rssi'], device.rssi),
    //   };
    // }
    case removeDevice.SUCCESS: {
      const { device } = (action.payload: RemoveDevicePayload | any);
      return {
        ...state,
        devices: state.devices.delete(device.id),
      };
    }
    default:
      return state;
  }
};
