import React from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux'
import { AppRegistry } from 'react-native';
import { addNavigationHelpers } from "react-navigation";
import configureStore from './src/store/configureStore';
import { AppNavigator } from './src/AppNavigator';

class App extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const mapStateToProps = (state) => ({
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
