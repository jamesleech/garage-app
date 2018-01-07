import React, { Component } from "react";
import styled from "styled-components/native";
import { CommonInput, CommonButton } from '../index';

const Wrapper = styled.View`
  padding: 20px;
`;

class SignInForm extends Component {
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
          onSubmitEditing={() => this.passwordInput.focus()}
          onChangeText={username => this.setState({username})}
        />
        <CommonInput
          secureTextEntry
          returnKeyType='go'
          placeholder='password'
          placeholderTextColor='rgba(255,255,255,0.5)'
          innerRef={(input) => this.passwordInput = input}
          onChangeText={password => this.setState({password})}
        />
        <CommonButton
          label='Login'
          onPress={() => {
            onSignIn({ username: this.state.username, password: this.state.password });
          }} />
      </Wrapper>
    );
  }
}

export { SignInForm };
