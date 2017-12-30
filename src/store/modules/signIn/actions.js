import { createAction } from '../../createAction';

const ActionPrefix = 'jg/signIn/';

export const signIn = createAction(ActionPrefix + 'SIGN_IN');
export const signOut = createAction(ActionPrefix + 'SIGN_OUT');
