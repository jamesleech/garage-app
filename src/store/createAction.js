import { put, take } from 'redux-saga/effects';

export const createAction = (prefix, additionalActions = []) => {
  const type = `${prefix}_REQUEST`;
  const action = payload => ({ type, payload });
  action.payload = undefined;
  action.REQUEST = type;
  action.SUCCESS = `${prefix}_SUCCESS`;
  action.FAILURE = `${prefix}_FAILURE`;
  action.request = payload => ({ type: action.REQUEST, payload });
  action.success = payload => ({ type: action.SUCCESS, payload });
  action.failure = error => ({
    type: action.FAILURE,
    payload: error,
    error: true,
  });

  action.call = function* (payload) {
    yield put(action(payload));
    return yield take([action.SUCCESS, action.FAILURE]);
  };

  additionalActions.forEach(actionName => {
    const code = actionName.split(/(?=[A-Z])/).join('_').toUpperCase();
    action[code] = `${prefix}_${code}`;
    action[actionName] = payload => ({ type: action[code], payload });
  });

  return action;
};
