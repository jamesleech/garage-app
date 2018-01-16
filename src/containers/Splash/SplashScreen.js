import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SplashView, SplashText, SplashSubText } from '../../components';

class SplashScreen extends Component {
  static navigationOptions = () => ({
    header: null
  });

  render() {
    return (
      <SplashView>
        <SplashText>James&apos; Garage</SplashText>
        <SplashSubText>Version 0.1</SplashSubText>
      </SplashView>
    );
  }
}

// const screen = connect()(SplashScreen);
export { SplashScreen };
