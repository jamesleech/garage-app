import { loadDevices, saveDevice, removeDevice } from './index';

const initialState = {
  loading: false,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case loadDevices.SUCCESS:
    //   return {
    //     ...state,
    //   };
    default:
      return state
  }
};
