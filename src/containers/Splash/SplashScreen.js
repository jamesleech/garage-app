import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SplashView, SplashText, SplashSubText } from '../../components';

class SplashScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null
  });

  render() {
    console.log(`Splash.render ${JSON.stringify(this.props)}`);

    return (
      <SplashView>
        <SplashText>James' Garage</SplashText>
        <SplashSubText>Version 0.1</SplashSubText>
      </SplashView>
    )
  }
}

function mapStateToProps(state) {
  return {
    splash: state.splash
  }
}

SplashScreen = connect(
  mapStateToProps
)(SplashScreen);

export { SplashScreen }
