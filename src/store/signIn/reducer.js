// @flow
import type {
  Action,
  SignInPayload,
  LoadUserPayload,
  User
} from '../index';
import {
  loadUser, signIn, signOut
} from '../index';

type SignInError = {
  message?: string;
};

type State = {
  +loading: boolean;
  +signedIn: boolean;
  +signInError?: SignInError;
  +user?: User;
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
    case loadUser.SUCCESS: {
      const { user } = action.payload;
      return {
        ...state,
        loading: false,
        user: {...user}
      };
    }
    case loadUser.FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
      };
    case signIn.REQUEST: {
      return {
        ...state,
        loading: true,
        signInError: undefined,
      };
    }
    case signIn.SUCCESS: {
      const { user } = action.payload;
      return {
        ...state,
        loading: false,
        signedIn: true,
        signInError: undefined,
        user: {...user},
      };
    }
    case signIn.FAILURE: {
      const payload = (action.payload: SignInPayload | any);
      return {
        ...state,
        loading: false,
        signedIn: false,
        signInError: {
          message: payload.errorMessage,
        },
        user: null,
      };
    }
    case signOut.SUCCESS:
      return {
        ...state,
        loading: false,
        user: null,
        session: undefined,
      };
    case signOut.FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        session: undefined,
      };
    default:
      return state;
  }
};
