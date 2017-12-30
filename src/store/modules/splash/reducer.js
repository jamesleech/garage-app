import { restore } from './actions';

const initialState = {
  loading: true,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case restore.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case restore.SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.payload,
      };
    case restore.FAILURE:
      return {
        ...state,
        loading: false,
        username: null
      };
    default:
      return state;
  }
};
