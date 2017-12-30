import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { SignInView, SignInLogo } from '../../components';
import { SignInForm } from '../../components';
import { signIn } from '../../store/modules/signIn';

class SignInScreen extends Component {
  static navigationOptions = {
    header: null,
    headerLeft: null
  };

  render() {
    const { doSignIn } = this.props;
    return (
      <SignInView>
        <SignInLogo />
        <SignInForm onSignIn={ doSignIn } />
      </SignInView>
    );
  }
}

function mapStateToProps(state) {
  return {
    splash: state.splash
  }
}

SignInScreen = connect(
  mapStateToProps,
  {
    doSignIn: signIn
  }
)(SignInScreen);

export { SignInScreen };
