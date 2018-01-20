// @flow
import React from 'react';
import styled from 'styled-components/native/index';
import type { ActionFunc } from '../../store';

const CommonTouchable = styled.TouchableOpacity`
  background-color: #3498db;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const CommonText = styled.Text`
  text-align: center;
  color: white;
  font-weight: 700;
`;

type Props = {
  onPress: ActionFunc<>;
  label: string;
}

const CommonButton = ({ onPress, label }: Props) => (
    <CommonTouchable onPress={onPress}>
      <CommonText>{label}</CommonText>
    </CommonTouchable>
  );

export { CommonButton };
