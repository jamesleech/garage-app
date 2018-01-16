// @flow
import { ActionCreator } from '../../ActionCreator';
import { User } from '../index';

const ActionPrefix = 'jg/splash/';

export type RestorePayload = {
  user: User;
}

export const restore: ActionCreator<RestorePayload> = new ActionCreator(ActionPrefix, 'RESTORE');
