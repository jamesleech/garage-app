import React from 'react';
import styled from 'styled-components/native';

const SignInTouchable = styled.TouchableOpacity`
  background-color: #3498db;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const SignInLoginText = styled.Text`
  text-align: center;
  color: white;
  font-weight: 700;
`;

const SignInButton = ({ onPress }) => (
    <SignInTouchable onPress={onPress}>
      <SignInLoginText>Login</SignInLoginText>
    </SignInTouchable>
  );

export { SignInButton };
