import React from 'react';
import { StatusBar } from 'react-native'
import styled from 'styled-components/native';

const Wrapper = styled.View`
  flex: 1;
  background-color: #2980b9;
  justify-content: center;
  align-items: center;  
`;

const SplashView = ({ children }) => (
    <Wrapper behavior='padding'>
      <StatusBar barStyle='light-content' />
      {children}
    </Wrapper>
  );

export { SplashView };
