import React, { Component } from "react";
import styled from "styled-components/native";
import { SignInButton, SignInInput } from '../index';

const Wrapper = styled.View`
  padding: 20px;
`;

class SignInForm extends Component {
  render() {
    const { onSignIn } = this.props;
    return (
      <Wrapper>
        <SignInInput
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='next'
          placeholder='username'
          placeholderTextColor='rgba(255,255,255,0.5)'
          onSubmitEditing={() => this.passwordInput.focus()}
          onChangeText={username => this.setState({username})}
        />
        <SignInInput
          secureTextEntry
          returnKeyType='go'
          placeholder='password'
          placeholderTextColor='rgba(255,255,255,0.5)'
          innerRef={(input) => this.passwordInput = input}
          onChangeText={password => this.setState({password})}
        />
        <SignInButton
          title='Login'
          onPress={() => {
            onSignIn({ username: this.state.username, password: this.state.password });
          }} />
      </Wrapper>
    );
  }
}

export { SignInForm };
