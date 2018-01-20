// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  
`;

const FormattedText = styled.Text`
  color: white;
  font-size: 35px;
  font-weight: bold;
`;

type Props = {
  children: Node;
}

const SplashText = ({ children }: Props) => (
    <Wrapper>
      <FormattedText>{children}</FormattedText>
    </Wrapper>
  );


export { SplashText };
