import { takeLatest, put, call } from 'redux-saga/effects';
import {
  signIn,
  signOut,
} from './actions';
import {NavigationActions} from 'react-navigation';

function* signInWorker(action) {
  try {
    //TODO: user credentials store
    const { username, password, reload } = action.payload;

    const result = reload || (username === 'James' && password === 'sand');

    if(result) {
      yield put(signIn.success({username}));
    } else {
      yield put(signIn.failure({
        errorMessage: 'wrong username and/or password'
      }));
    }
  } catch (exception) {
    yield put(signIn.failure(exception));
  }
}

function* signOutWorker() {
  try {
    yield put(signOut.success());
  } catch (exception) {
    yield put(signOut.failure(exception));
  }
}

function* signedInNavigate(action) {
  yield put(NavigationActions.navigate({
    routeName: 'Home',
    params: {
      username: action.payload.username,
    }
  }))
}

export function* saga() {
  yield takeLatest(signIn.REQUEST, signInWorker);
  yield takeLatest(signIn.SUCCESS, signedInNavigate);

  yield takeLatest(signOut.REQUEST, signOutWorker);
}
