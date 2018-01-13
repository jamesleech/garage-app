// @flow
import { ActionCreator } from '../../ActionCreator';
import { User } from '../';

const ActionPrefix = 'jg/splash/';

export interface RestorePayload {
  user: User;
}

export const restore: ActionCreator<RestorePayload> = new ActionCreator(ActionPrefix, 'RESTORE');
