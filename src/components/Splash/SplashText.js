import React, { Component } from "react";
import styled from "styled-components/native";


const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  
`;

const FormattedText = styled.Text`
  color: white;
  font-size: 35px;
  font-weight: bold;
`;

const SplashText = ({ children }) => (
    <Wrapper>
      <FormattedText>{children}</FormattedText>
    </Wrapper>
  );


export { SplashText };
