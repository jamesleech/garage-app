// @flow
import { restore } from './actions';
import type { Action, RestorePayload } from '../index';

type State = {
  +loading: boolean;
}

const initialState: State = {
  loading: true,
};

export type Actions = Action<RestorePayload>;

export const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case restore.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case restore.SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case restore.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};
