// @flow
import { call, put, takeLatest } from 'redux-saga/effects';
import { NavigationActions } from 'react-navigation';
import { loadUser, signIn, loadDevices } from '../';
import { restore, RestorePayload } from './actions';
import { Action } from '../../Action';

function* restoreWorker(): Generator<*,*,*> {
  try {
    // yield delay(500);
    // yield call(AsyncStorage.clear);

    yield call(console.log, 'restoreWorker.loadUsername');
    const userResult = yield call(loadUser.call);
    yield call(console.log, `restoreWorker.loadUsername: ${JSON.stringify(userResult)}`);

    if(userResult.type === loadUser.SUCCESS) {
      const user = userResult.payload;
      // no web login, currently only bluetooth enabled
      if(user.username) {
        yield call(console.log, 'restoreWorker.loadDevices');
        const result = yield call(loadDevices.call);
        yield call(console.log, `restoreWorker: load devices results: ${JSON.stringify(result)}`);
        yield put(restore.success(user));
      } else {
        yield put(restore.failure({
          errorMessage: 'failed to load previous details'
        }));
      }
    } else {
      yield put(restore.failure({
        errorMessage: 'failed to load previous details'
      }));
    }
  } catch (exception) {
    yield call(console.error, `restoreWorker exception: ${exception}`);
    yield put(restore.failure({
      errorMessage: 'failed to load previous details'
    }));
  }
}

function* signInNavigate(): Generator<*,*,*> {
  yield put(NavigationActions.navigate({ routeName: 'SignIn' }));
}

function* signedInNavigate(action: Action<RestorePayload>): Generator<*,*,*> {
  const { user } = action.payload;
  yield call(console.log, 'signedInNavigate');
  yield put(signIn.success({ user }));
}

export function* saga(): Generator<*,*,*> {
  yield takeLatest(restore.REQUEST, restoreWorker);
  yield takeLatest(restore.FAILURE, signInNavigate);
  yield takeLatest(restore.SUCCESS, signedInNavigate);
}
