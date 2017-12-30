import React, { Component } from 'react';
import styled from "styled-components/native";
import { StatusBar } from "react-native";

const Wrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #2980b9;
`;

const SignInView = ({ children }) => {
  return (
    <Wrapper behavior='padding'>
      <StatusBar
        barStyle='light-content'
      />
      {children}
      </Wrapper>
  );
};

export { SignInView };
