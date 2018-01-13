// @flow
import { restore, RestorePayload } from './actions';
import { Action } from '../../Action';

interface State {
  +loading: boolean;
  +username: string;
}

const initialState: State = {
  loading: true,
  username: "",
};

export type Actions = Action<RestorePayload>;

export const reducer = (state: State = initialState, action: Actions): State => {
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
        username: ""
      };
    default:
      return state;
  }
};
