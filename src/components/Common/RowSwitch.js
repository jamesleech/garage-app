import React from 'react';
import styled from 'styled-components/native/index';
import { RowView, RowText } from './index';

const StyledSwitch = styled.Switch`
  margin-left: auto;
`;

const RowSwitch = ( { text }) => (
    <RowView>
      <RowText>{text}</RowText>
      <StyledSwitch/>
    </RowView>
  );

export { RowSwitch };
