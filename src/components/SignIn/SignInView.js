// @flow
import React from 'react';
import type { Node } from 'react';
import styled from "styled-components/native";
import { StatusBar } from "react-native";

const Wrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #2980b9;
`;

type Props = {
  children: Node;
}
const SignInView = ({ children }: Props) => (
    <Wrapper behavior='padding'>
      <StatusBar barStyle='dark-content' />
      {children}
    </Wrapper>
  );

export { SignInView };
