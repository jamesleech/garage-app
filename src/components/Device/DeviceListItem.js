// @flow
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import {
  RowText,
  DeviceSignalStrength
} from '../index';
import type {
  ActionFunc,
  BleDevice,
} from '../../store';

const StyledTouchableOpacity = styled.TouchableOpacity`
  display: flex;
  background-color: #3498db;
  margin-bottom: 2px;
`;

const ItemView = styled.View`
  display: flex;
  width: 100%;
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  margin: 4px 4px;
`;

type Props = {
  device: BleDevice;
  onLinkPress: ActionFunc<BleDevice>;
}

const DeviceListItem = ({ device, onLinkPress }: Props) => {

  const handlePress = () => {
    console.log(`DeviceListItem.handlePress: ${JSON.stringify(device)}`);
    onLinkPress(device);
  };

  return (
    <StyledTouchableOpacity onPress={handlePress}>
      <View>
        <ItemView>
          <RowText>{device.name || device.id}</RowText>
        </ItemView>
        <DeviceSignalStrength strength={device.rssi}/>
      </View>
    </StyledTouchableOpacity>
  );
};

export { DeviceListItem };
