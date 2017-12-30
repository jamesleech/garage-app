import { combineReducers } from 'redux';
import { splashReducer } from './splash';
import { signInReducer } from './signIn';
import { navReducer } from './navigation';
import { bleReducer } from './ble';

export const getRootReducer = () => combineReducers({
  nav: navReducer,
  splash: splashReducer,
  signIn: signInReducer,
  ble: bleReducer,
});
