// @flow
import type { Action } from '../Action';
import {bleDeviceConnect, bleDeviceDisconnect, startLinkDevice} from '../index';
import type {BleDevice, StartLinkDevicePayload, bleDeviceConnectPayload, bleDeviceDisconnectPayload} from '../index';

type State = {
  +device: BleDevice;
}

const initialState: State = {
  device: null,
};

export type Actions = Action<StartLinkDevicePayload | bleDeviceConnectPayload | bleDeviceDisconnectPayload>;

export const reducer = (state: State = initialState, action: Actions) => {
  switch (action.type) {
    case startLinkDevice.REQUEST: {
      return {
        ...state,
        device: action.payload.device,
      };
    }
    case bleDeviceConnect.REQUEST: {
      const { device } = action.payload;
      if(state.device && state.device.id === device.id) {
        return {
          ...state,
          device: {
            ...state.device,
            status: 'connecting',
          }
        };
      }
      return state;
    }
    case bleDeviceConnect.SUCCESS: {
      const { device } = action.payload;
      if(state.device && state.device.id === device.id) {
        return {
          ...state,
          device: {
            ...state.device,
            status: 'connected',
          }
        };
      }
      return state;
    }
    case bleDeviceDisconnect.REQUEST: {
      const { device } = action.payload;
      if(state.device && state.device.id === device.id) {
        return {
          ...state,
          device: {
            ...state.device,
            status: 'disconnecting',
          }
        };
      }
      return state;
    }
    case bleDeviceDisconnect.SUCCESS: {
      const { device } = action.payload;
      if(state.device && state.device.id === device.id) {
        return {
          ...state,
          device: {
            ...state.device,
            status: 'notConnected',
          }
        };
      }
      return state;
    }
    default:
      return state;
  }
};
