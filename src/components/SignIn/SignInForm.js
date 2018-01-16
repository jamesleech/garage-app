// @flow
import React, { Component } from "react";
import styled from "styled-components/native";
import { CommonInput, CommonButton } from '../index';
import type { ActionFunc } from '../../store/Action';
import type { SignInPayload } from '../../store/modules/signIn/actions';

const Wrapper = styled.View`
  padding: 20px;
`;

type Props = {
  onSignIn: ActionFunc<SignInPayload>
};

type State = {
  username: string,
  password: string,
};

class SignInForm extends Component<Props, State> {

  passwordInput: ?CommonInput;

  handleSignIn = (onSignIn: ActionFunc<SignInPayload>) => {
    onSignIn({
      user: {
        username: this.state.username, password: this.state.password
      }
    });
  };

  render() {
    const { onSignIn } = this.props;
    return (
      <Wrapper>
        <CommonInput
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='next'
          placeholder='username'
          placeholderTextColor='rgba(255,255,255,0.5)'
          onSubmitEditing={() => this.passwordInput && this.passwordInput.focus()}
          onChangeText={username => this.setState({username})}
        />
        <CommonInput
          secureTextEntry
          returnKeyType='go'
          placeholder='password'
          placeholderTextColor='rgba(255,255,255,0.5)'
          innerRef={input => { this.passwordInput = input; }}
          onChangeText={password => this.setState({password})}
        />
        <CommonButton
          label='Login'
          onPress={() => this.handleSignIn(onSignIn)} />
      </Wrapper>
    );
  }
}

export { SignInForm };
