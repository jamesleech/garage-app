import { call, put, takeLatest } from 'redux-saga/effects';
import { signIn } from '../signIn';
import { loadDevices } from '../knownDevices';
import { restore } from './actions';
import { loadUser } from '../signIn';
import { NavigationActions } from 'react-navigation'
import {AsyncStorage} from "react-native";

// //Don't allow back button
// const ResetNavigation = (navigation, targetRoute, params) => {
//   const resetAction = NavigationActions.reset({
//     index: 0,
//     actions: [
//       NavigationActions.navigate({
//         routeName: targetRoute,
//         params: params
//       }),
//     ],
//   });
//
//   navigation.dispatch(resetAction);
// };

function* restoreWorker() {
  try {
    // yield delay(500);
    yield call(AsyncStorage.clear);

    yield call(console.log, 'restoreWorker.loadUsername');
    const userResult = yield call(loadUser.call);
    yield call(console.log, `restoreWorker.loadUsername: ${JSON.stringify(userResult)}`);

    if(userResult.type === loadUser.SUCCESS) {
      const user = userResult.payload;
      // no web login, currently only bluetooth enabled
      if(user.username) {
        yield put(restore.success(user));

        yield call(console.log, 'restoreWorker.loadDevices');
        const result = yield call(loadDevices.call);
        yield call(console.log, `restoreWorker: load devices results: ${JSON.stringify(result)}`);
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

function* signInNavigate() {
  yield put(NavigationActions.navigate({ routeName: 'SignIn' }));
}

function* signedInNavigate(action) {
  const user = action.payload;
  yield call(console.log, 'signedInNavigate');
  yield put(signIn.success(user));
}

export function* saga() {
  yield takeLatest(restore.REQUEST, restoreWorker);
  yield takeLatest(restore.FAILURE, signInNavigate);
  yield takeLatest(restore.SUCCESS, signedInNavigate);
}
