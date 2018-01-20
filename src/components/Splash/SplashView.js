// @flow
import React from 'react';
import type { Node } from 'react';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  flex: 1;
  background-color: #2980b9;
  justify-content: center;
  align-items: center;  
`;

type Props = {
  children: Node;
}

const SplashView = ({ children }: Props) => (
    <Wrapper behavior='padding'>
      <StatusBar barStyle='light-content' />
      {children}
    </Wrapper>
  );

export { SplashView };
