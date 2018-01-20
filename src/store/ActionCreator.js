// @flow
import { call, put, take } from 'redux-saga/effects';
import type { Action, ActionFunc } from './Action';

export class ActionCreator<T> {
  type: string;
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;

  constructor(prefix: string, actionName: string) {
    const a = `${prefix}${actionName}`;
    this.type = `${a}_REQUEST`;

    this.REQUEST = this.type;
    this.SUCCESS = `${a}_SUCCESS`;
    this.FAILURE = `${a}_FAILURE`;
  }

  request: ActionFunc<T> = (payload: T): Action<T> => ({
    type: this.REQUEST,
    payload
  });

  success: ActionFunc<T> = (payload: T): Action<T> => ({
    type: this.SUCCESS,
    payload
  });

  failure: ActionFunc<T> = (error: T): Action<T> => ({
    type: this.FAILURE,
    payload: error,
    error: true
  });

  call = (payload: T) => ActionCreator.callGenerator(this, payload);

  static callGenerator = function* xyz(_this: any, data: any): Generator<*,*,*> {
    yield put(_this.request(data));
    return yield take([_this.SUCCESS, _this.FAILURE]);
  };
}

/*
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

 */
