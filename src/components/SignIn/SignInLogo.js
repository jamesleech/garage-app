import React  from "react";
import styled from "styled-components/native";

const logo = require('../../resources/images/logo.png');

const Wrapper = styled.View`
  flex-grow: 1;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.Image`
  width: 100px;
  height: 100px;
`;

const LogoText = styled.Text`
  color: white;
  margin-top: 10px;
  opacity: 0.8;
`;

const SignInLogo = () => (
    <Wrapper>
      <Logo source={logo}/>
      <LogoText>Garage Opener</LogoText>
    </Wrapper>
  );

export { SignInLogo };
