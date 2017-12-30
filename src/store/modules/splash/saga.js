import { call, put, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { signIn } from '../signIn';
import { restore } from './actions';
import { NavigationActions } from 'react-navigation'

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

const debugSignin = false;

function* restoreWorker() {
  try {
    yield call(console.log, 'restoreWorker: putting success');
    yield delay(500);
    //TODO: skipping web login, currently only bluetooth enabled

    if(debugSignin) {
      yield put(restore.failure({
        errorMessage: 'failed to load previous details'
      }));
    } else {
      yield put(restore.success({
        username: 'James'
      }));
    }
  } catch (exception) {
    yield put(restore.failure({
      errorMessage: 'failed to load previous details'
    }));
  }
}

function* signInNavigate() {
  yield put(NavigationActions.navigate({ routeName: 'SignIn' }));
}

function* signedInNavigate(action) {
  yield put(signIn.success({
    username: action.payload.username,
  }));
}

export function* saga() {
  yield takeLatest(restore.REQUEST, restoreWorker);

  yield takeLatest(restore.FAILURE, signInNavigate);
  yield takeLatest(restore.SUCCESS, signedInNavigate);
}
