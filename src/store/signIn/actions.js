// @flow
import { ActionCreator } from '../ActionCreator';

const ActionPrefix = 'jg/signIn/';

export type User = {
  username: string;
  password?: string;
  loaded?: boolean;
}

export type SignInPayload = {
  user: User;
  errorMessage?: string;
}
export type SignOutPayload = {
  error?: any;
}

export type LoadUserPayload = {
  user: User;
}

export type BCryptPasswordPayload = {
  password: string;
}

const signIn: ActionCreator<SignInPayload> = new ActionCreator(ActionPrefix, 'SIGN_IN');
const signOut: ActionCreator<SignOutPayload> = new ActionCreator(ActionPrefix, 'SIGN_OUT');
const bcryptPassword: ActionCreator<BCryptPasswordPayload> = new ActionCreator(ActionPrefix, 'BCRYPT_PASSWORD');
const loadUser: ActionCreator<LoadUserPayload> = new ActionCreator(ActionPrefix, 'LOAD_USER');

export { signIn, signOut, bcryptPassword, loadUser };
