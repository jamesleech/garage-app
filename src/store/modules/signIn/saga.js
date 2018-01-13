// @flow
import { NavigationActions } from 'react-navigation';
import { AsyncStorage } from "react-native";
import { takeLatest, takeEvery, put, call } from 'redux-saga/effects';
import { Action } from '../../Action';
import {
  loadUser, signIn, signOut, bcryptPassword,
  SignInPayload
} from './actions';

function* signInWorker(action: Action<SignInPayload>): Generator<*,*,*> {
  try {
    yield call(console.log, `signInWorker: ${JSON.stringify(action)}`);

    const { user } = action.payload;

    // TODO: check password
    if(user.username) {
      yield put(signIn.success(action.payload));
    } else {
      yield put(signIn.failure({
        errorMessage: 'wrong username and/or password'
      }));
    }
  } catch (error) {
    yield call(console.error, `signInWorker exception: ${error}`);
    yield put(signIn.failure({ error }));
  }
}

function* signOutWorker(): Generator<*,*,*> {
  try {
    yield call(AsyncStorage.removeItem, 'user');
    yield put(signOut.success());
  } catch (error) {
    yield call(console.error, `signOutWorker exception: ${error}`);
    yield put(signOut.failure({ error }));
  }
}

// Don't allow back button
const ResetNavigation = (targetRoute: string, params) => NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({
      routeName: targetRoute,
      params
    }),
  ],
});

function* signedInNavigate(action: Action<SignInPayload>): Generator<*,*,*> {
  const { user } = action.payload;
  yield put(ResetNavigation('Home', { username: user.username }));
}

function* loadUserWorker(): Generator<*,*,*> {
  try {
    yield call(console.log, `loadUserWorker: start`);
    const item = yield call(AsyncStorage.getItem, 'user');
    yield call(console.log, `loadUserWorker: gotItem ${item}`);
    const user = JSON.parse(item);

    if(user && user.username) {
      user.loaded = true;
      console.log(`loadUserWorker: ${user.username}`);
      yield put(loadUser.success({ user }));
    } else {
      yield put(loadUser.failure({
        errorMessage: 'failed to load previous user details'
      }));
    }
  } catch (error) {
    yield call(console.error, `loadUserWorker exception: ${error}`);
    yield put(loadUser.failure({
      errorMessage: 'failed to load previous user details'
    }));
  }
}

function* saveUserWorker(action: Action<SignInPayload>): Generator<*,*,*> {
  const { user } = action.payload;
  if(!user.loaded) {
    yield call(console.log, `saveUserWorker: saving ${JSON.stringify(user)}`);
    const result = yield call(bcryptPassword.call, user.password);
    if(result.type === bcryptPassword.SUCCESS) {
      user.password = result.payload.password;
      yield call(AsyncStorage.setItem, 'user', JSON.stringify(user));
    }
  }
}

function* bcryptPasswordWorker(action): Generator<*,*,*> {
  // TODO: bcrypt password, for now just return the password
  yield put(bcryptPassword.success(action.payload));
}

export function* saga(): Generator<*,*,*> {
  yield takeEvery(bcryptPassword.REQUEST, bcryptPasswordWorker);
  yield takeLatest(loadUser.REQUEST, loadUserWorker);

  yield takeLatest(signIn.REQUEST, signInWorker);
  yield takeLatest(signIn.SUCCESS, saveUserWorker);
  yield takeLatest(signIn.SUCCESS, signedInNavigate);

  yield takeLatest(signOut.REQUEST, signOutWorker);
}
