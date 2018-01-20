// @flow
import React from 'react';
import styled from 'styled-components/native';
import type { ActionFunc} from '../../store';

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

type Props = {
  onPress: ActionFunc<>
}

const SignInButton = ({ onPress }: Props) => (
    <SignInTouchable onPress={onPress}>
      <SignInLoginText>Login</SignInLoginText>
    </SignInTouchable>
  );

export { SignInButton };
