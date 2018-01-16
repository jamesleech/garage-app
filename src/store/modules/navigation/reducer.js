// TODO: @ flow

import type { NavigationAction } from 'react-navigation/lib/TypeDefinition';
import { AppNavigator } from '../../../AppNavigator';

// initial nav state needs to get the action for a path in the AppNavigator
const initialNavState =
  AppNavigator.router.getStateForAction(
    AppNavigator.router.getActionForPathAndParams('Splash')
  );

export const reducer = (state: any = initialNavState, action: NavigationAction) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};
