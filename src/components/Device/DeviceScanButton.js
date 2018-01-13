import React from 'react';
import styled from 'styled-components/native';

const DeviceScanTouchable = styled.TouchableOpacity`
  width: 98%;
  flex-direction: row;
  align-items: center;
  background-color: #3498db;
  margin: 1%;
`;

const DeviceScanText = styled.Text`
  flex: 1;
  width: 100%;
  text-align: center;
  color: white;
  font-weight: 700;
  align-self: center;
  flex-direction: row;
  padding-top: 6%;
  padding-bottom: 6%;
`;

const DeviceScanButton = ({ scanning, startScanning, stopScanning }) => {
  let text = '';
  let onPress;
  if (scanning) {
    text = 'Stop';
    onPress = stopScanning;
  } else {
    text = 'Scan';
    onPress = startScanning;
  }

  return (
    <DeviceScanTouchable onPress={onPress}>
      <DeviceScanText>{text}</DeviceScanText>
    </DeviceScanTouchable>
  );
};

export { DeviceScanButton };
