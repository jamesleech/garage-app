import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SignInView, SignInLogo, SignInForm } from '../../components';
import { signIn } from '../../store/modules/signIn';

class SignInScreen extends Component {
  static navigationOptions = {
    header: null,
    headerLeft: null
  };

  static mapDispatchToProps = {
    doSignIn: signIn.request
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

const screen = connect(null, SignInScreen.mapDispatchToProps)(SignInScreen);

export { screen as SignInScreen };
