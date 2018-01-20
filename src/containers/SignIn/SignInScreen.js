// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SignInView, SignInLogo, SignInForm } from '../../components';
import { signIn } from '../../store/signIn/actions';
import type { ActionFunc, SignInPayload } from '../../store';

type Props = {
  doSignIn: ActionFunc<SignInPayload>
}

class SignInScreen extends Component<Props> {
  static navigationOptions = {
    header: null,
    headerLeft: null
  };

  static mapDispatchToProps = () => {
    console.log(`${signIn.REQUEST}`);
    return {
      doSignIn: signIn.request
    };
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

const screen = connect(null, SignInScreen.mapDispatchToProps())(SignInScreen);

export { screen as SignInScreen };
