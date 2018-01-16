// @flow
import type { Action } from '../../Action';
import type { SignInPayload } from './actions';
import {
  loadUser, signIn, signOut,
  LoadUserPayload,
} from './actions';

type SignInError = {
  message?: string;
};

type State = {
  +loading: boolean;
  +signedIn: boolean;
  +signInError?: SignInError;
  +username?: string;
  +session?: string;
}

const initialState: State = {
  loading: false,
  signedIn: false,
};

export type Actions = Action<LoadUserPayload | SignInPayload>;

export const reducer = (state: State = initialState, action: Actions): State => {
  switch (action.type) {
    case loadUser.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case loadUser.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case loadUser.FAILURE:
      return {
        ...state,
        loading: false,
      };
    case signIn.REQUEST:
      return {
        ...state,
        loading: true,
        signInError: undefined,
        username: action.payload.user.username,
      };
    case signIn.SUCCESS:
      return {
        ...state,
        loading: false,
        signedIn: true,
        signInError: undefined,
      };
    case signIn.FAILURE:
      return {
        ...state,
        loading: false,
        signedIn: false,
        signInError: {
          message: action.payload.errorMessage,
        },
      };
    case signOut.SUCCESS:
      return {
        ...state,
        loading: false,
        username: undefined,
        session: undefined,
      };
    case signOut.FAILURE:
      return {
        ...state,
        loading: false,
        username: undefined,
        session: undefined,
      };
    default:
      return state;
  }
};
