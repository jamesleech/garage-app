import React from 'react';
import { View, StatusBar } from "react-native";
import styled from 'styled-components/native/index';

const Wrapper = styled.View`
  flex: 1;
  background-color: #2980b9;
`;

const StatusBarWrapper = ( { className, barStyle, children }) =>
  <Wrapper className={ className}>
    <StatusBar barStyle={barStyle || 'dark-content' } />
    {children}
  </Wrapper>;


export { StatusBarWrapper };
