import React from 'react';
import styled from 'styled-components/native/index';

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

const CommonButton = ({ onPress, label }) => (
    <CommonTouchable onPress={onPress}>
      <CommonText>{label}</CommonText>
    </CommonTouchable>
  );

export { CommonButton };
