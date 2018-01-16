// @flow
import { Map } from 'immutable';
import {
  bleScanStart,
  bleScanStop,
  bleUpdateState,
  bleDeviceFound,
} from './actions';
import type {
  bleScanStartPayload, bleScanStopPayload, bleDeviceFoundPayload, bleUpdateStatePayload, Device,
} from './actions';
import type {Action} from '../../Action';

type State = {
  +on: boolean,
  +scanning: boolean,
  +devices: Map<string, Device>,
}

export type Actions = Action<
  bleUpdateStatePayload | bleScanStartPayload | bleScanStopPayload | bleDeviceFoundPayload>;

const initialState: State = {
  on: false,
  scanning: false,
  devices: Map(
  //   [
  //     [
  //       '4123-13123-33145-4536',
  //       {
  //         id: '4123-13123-33145-4536',
  //         name: 'Garage Opener 4',
  //         rssi: -31,
  //       }
  //     ],
  //     [
  //       '5555-13123-33145-4536',
  //       {
  //         id: '5555-13123-33145-4536',
  //         name: 'James MacBook Pro',
  //         rssi: -50,
  //       }
  //     ],
  // ]
  ),
};

export const reducer = (state: State = initialState, action: Actions) => {
  switch (action.type) {
    case bleUpdateState.SUCCESS:
      return {
        ...state,
        on: action.payload === 'on',
      };
    case bleScanStart.REQUEST:
      return {
        ...state,
        scanning: true,
        devices: Map(),
      };
    case bleScanStart.FAILURE:
      return {
        ...state,
        scanning: false,
      };
    case bleScanStop.SUCCESS:
      return {
        ...state,
        scanning: false,
      };
    case bleScanStop.FAILURE:
      return {
        ...state,
        scanning: true,
      };
    case bleDeviceFound.SUCCESS: {
      const { device } = action.payload;
      return {
        ...state,
        devices: state.devices.set(device.id, device),
      };
    }
    default:
      return state;
  }
};
