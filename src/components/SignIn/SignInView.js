import React from 'react';
import styled from "styled-components/native";
import { StatusBar } from "react-native";

const Wrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #2980b9;
`;

const SignInView = ({ children }) => (
    <Wrapper behavior='padding'>
      <StatusBar barStyle='dark-content' />
      {children}
    </Wrapper>
  );

export { SignInView };
