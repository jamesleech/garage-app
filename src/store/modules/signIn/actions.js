// @flow
import { ActionCreator } from '../../ActionCreator';

const ActionPrefix = 'jg/signIn/';

export type User = {
  username: string;
  password: string;
  loaded?: boolean;
}

export type SignInPayload = {
  user: User;
  errorMessage?: string;
}
export type SignOutPayload = {
  error: any;
}

export interface LoadUserPayload extends SignInPayload {
}
export interface BCryptPasswordPayload {
  password: string;
}

export const signIn: ActionCreator<SignInPayload> = new ActionCreator(ActionPrefix, 'SIGN_IN');
export const signOut: ActionCreator<SignOutPayload> = new ActionCreator(ActionPrefix, 'SIGN_OUT');
export const bcryptPassword: ActionCreator<BCryptPasswordPayload> = new ActionCreator(ActionPrefix, 'BCRYPT_PASSWORD');
export const loadUser: ActionCreator<LoadUserPayload> = new ActionCreator(ActionPrefix, 'LOAD_USER');
