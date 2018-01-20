// @flow
import React from 'react';
import type { Node } from 'react';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native/index';

const Wrapper = styled.View`
  flex: 1;
  background-color: #2980b9;
`;

type Props = {
  className: string;
  barStyle: 'default' | 'light-content' | 'dark-content';
  children: Node;
}

const StatusBarWrapper = ( { className, barStyle, children }: Props) =>
  <Wrapper className={ className}>
    <StatusBar barStyle={barStyle || 'dark-content' } />
    {children}
  </Wrapper>;


export { StatusBarWrapper };
