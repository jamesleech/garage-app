import {
  bleScanStart,
  bleScanStop,
  bleUpdateState,
  bleDeviceFound,
  bleDeviceLink, bleDeviceConnect, bleDeviceDisconnect,
} from './actions';
import { List, Map } from 'immutable';

const initialState = {
  on: false,
  scanning: false,
  knownDevices: Map(
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
  devices: Map(
    [
      [
      '1123-13123-33145-4536',
      {
        id: '1123-13123-33145-4536',
        name: 'Garage Opener',
        rssi: -31,
      }
      ],
      [
        '5555-13123-33145-4536',
        {
          id: '5555-13123-33145-4536',
          name: 'James MacBook Pro',
          rssi: -50,
        }
      ],
  ]
  ),
};

const bleUpdateStateReducer = (state, payload) => {
  const on = payload === 'on'; //TODO: remove magic string

  let knownDevices;
  if(!on) {
    knownDevices = state.knownDevices.map(device => device.setIn(['status'], 'notConnected'));
  } else {
    knownDevices = state.knownDevices;
  }

  return {
    ...state,
    on,
    knownDevices
  };
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case bleUpdateState.SUCCESS:
      return bleUpdateStateReducer(state, action.payload);
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
    case bleDeviceLink.REQUEST:
      return {
        ...state,
        // selectedDevice: state.devices.get(action.payload),
      };
    case bleDeviceConnect.REQUEST:
      return {
        ...state,
        knownDevices: state.knownDevices.setIn([action.payload.id, 'status'], 'connecting'),
      };
    case bleDeviceConnect.SUCCESS:
      return {
        ...state,
        knownDevices: state.knownDevices.setIn([action.payload.id, 'status'], 'connected'),
      };
    case bleDeviceConnect.FAILURE:
      return {
        ...state,
        knownDevices: state.knownDevices.setIn([action.payload.id, 'status'], 'notConnected'),
      };
    case bleDeviceDisconnect.SUCCESS:
      return {
        ...state,
        knownDevices: state.knownDevices.setIn([action.payload.id, 'status'], 'notConnected'),
      };
    default:
      return state
  }
};
