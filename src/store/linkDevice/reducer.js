// @flow
import type { Action } from '../Action';
import { startLinkDevice } from '../index';
import type { BleDevice, StartLinkDevicePayload } from '../index';

type State = {
  +device: BleDevice;
}

const initialState: State = {
  device: null,
};

export type Actions = Action<StartLinkDevicePayload>;

export const reducer = (state: State = initialState, action: Actions) => {
  switch (action.type) {
    case startLinkDevice.REQUEST: {
      return {
        ...state,
        device: action.payload.device,
      };
    }
    default:
      return state;
  }
};
