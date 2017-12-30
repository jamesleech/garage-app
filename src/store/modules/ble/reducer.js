import {
  bleScanStart,
  bleScanStop,
  bleUpdateState,
  bleDeviceFound,
  bleDeviceSelected,
} from './actions';
import { List, Map } from 'immutable';

const initialState = {
  on: false,
  scanning: false,
  knownDevices: Map(
    [
      [
        '4C9AE077-E60A-9E90-7F09-C2064B7D36A5',
        {
          id: '4C9AE077-E60A-9E90-7F09-C2064B7D36A5',
          name: '**GarageOpener**',
          isConnected: false,
        }
      ],
    ]),
  selectedDevice: undefined,
  devices: Map(
  //   [
  //     [
  //     '1123-13123-33145-4536',
  //     {
  //       id: '1123-13123-33145-4536',
  //       name: 'Garage Opener',
  //       rssi: -31,
  //     }
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

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case bleUpdateState.SUCCESS:
      return {
        ...state,
        on: action.payload === 'on', //TODO: remove magic string
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
    case bleDeviceFound.SUCCESS:
      const device = action.payload;
      return {
        ...state,
        devices: state.devices.set(device.id, device),
      };
    case bleDeviceSelected.SUCCESS:
      return {
        ...state,
        selectedDevice: state.devices.get(action.payload),
      };
    default:
      return state
  }
};
