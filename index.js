// @flow
import React from 'react';
import { connect, Provider } from 'react-redux';
import { AppRegistry } from 'react-native';
import { addNavigationHelpers } from "react-navigation";
import configureStore from './src/store/configureStore';
import { AppNavigator } from './src/AppNavigator';

type State = {
  nav: any, // TODO
};

type Props = {
  dispatch: any, // TODO
  nav: any, // TODO
};

const App = ({ dispatch, nav}: Props) => (
  <AppNavigator navigation={addNavigationHelpers({
    dispatch,
    state: nav,
  })} />
);

const mapStateToProps = (state): State => ({
  nav: state.nav
});

const AppWithNavigationState = connect(mapStateToProps)(App);

const store = configureStore();

const ReduxApp = () => (
  <Provider store={store}>
    <AppWithNavigationState />
  </Provider>
);

AppRegistry.registerComponent('JamesGarage', () => ReduxApp);
