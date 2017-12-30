import {
  signIn,
  signOut,
} from './actions';

const initialState = {
  loading: false,
  signedIn: false,
  signInError: null,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case signIn.REQUEST:
      return {
        ...state,
        loading: true,
        signInError: null,
        username: action.payload.username,
      };
    case signIn.SUCCESS:
      return {
        ...state,
        loading: false,
        signedIn: true,
        signInError: null,
        username: action.payload.username,
      };
    case signIn.FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        signedIn: false,
        username: null,
        signInError: {
          message: action.payload.errorMessage,
        },
      };
    case signOut.SUCCESS:
      return {
        ...state,
        login: true,
        loading: false,
        user: null,
        session: null,
      };
    case signOut.FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        session: null,
      };
    default:
      return state
  }
};
