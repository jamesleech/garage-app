import { takeLatest, put, call } from 'redux-saga/effects';
import {
  loadUser,
  signIn,
  signOut,
} from './actions';
import {NavigationActions} from 'react-navigation';
import {AsyncStorage} from "react-native";

function* signInWorker(action) {
  try {
    yield call(console.log, `signInWorker: ${JSON.stringify(action)}`);

    const user = action.payload;

    if(user.username) {
      yield put(signIn.success(user));
    } else {
      yield put(signIn.failure({
        errorMessage: 'wrong username and/or password'
      }));
    }
  } catch (error) {
    yield call(console.error, `signInWorker exception: ${error}`);
    yield put(signIn.failure(error));
  }
}

function* signOutWorker() {
  try {
    yield call(AsyncStorage.removeItem, 'user');
    yield put(signOut.success());
  } catch (error) {
    yield call(console.error, `signOutWorker exception: ${error}`);
    yield put(signOut.failure(error));
  }
}

//Don't allow back button
const ResetNavigation = (targetRoute, params) => {
  return NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: targetRoute,
        params: params
      }),
    ],
  });
};

function* signedInNavigate(action) {
  yield put(ResetNavigation('Home', { username: action.payload.username }););
}

function* loadUserWorker() {
  try {
    console.log(`loadUserWorker: start`);
    const item = yield call(AsyncStorage.getItem, 'user');
    console.log(`loadUserWorker: gotItem ${item}`);
    const user = JSON.parse(item);

    if(user && user.username) {
      user.loaded = true;
      console.log(`loadUserWorker: ${user.username}`);
      yield put(loadUser.success(user));
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

function* saveUserWorker(action) {
  const user = action.payload;
  if(!user.loaded) {
    yield call(console.log, `saveUserWorker: saving ${JSON.stringify(user)}`);
    yield call(AsyncStorage.setItem, 'user', JSON.stringify(user));
  }
}

export function* saga() {
  yield takeLatest(loadUser.REQUEST, loadUserWorker);

  yield takeLatest(signIn.REQUEST, signInWorker);
  yield takeLatest(signIn.SUCCESS, saveUserWorker);
  yield takeLatest(signIn.SUCCESS, signedInNavigate);

  yield takeLatest(signOut.REQUEST, signOutWorker);
}
