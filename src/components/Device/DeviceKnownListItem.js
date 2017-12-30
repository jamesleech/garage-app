import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import {
  RowView,
  RowText,
  DeviceStatus
} from '../index';
import {DeviceSignalStrength} from './DeviceSignalStrength';

const StyledTouchableOpacity = styled.TouchableOpacity`
  display: flex;
  background-color: #3498db;
`;

const ItemView = styled.View`
  display: flex;
  width: 100%;
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  margin: 4px 4px;
`;

const ItemDivider = styled.View`
  background-color: #2980b9;
  height: 1px;
  width: 95%;
  align-self: center;
`;

const DeviceKnownListItem = ({item, onPress}) => {
  const pressed = () => {
    onPress(item);
  };

  return (
    <StyledTouchableOpacity onPress={pressed}>
      <View>
        <ItemView>
          <RowText>{item.name}</RowText>
        </ItemView>
        <DeviceStatus status={item.status}/>
        <DeviceSignalStrength strength = {item.rssi}/>
      </View>
    </StyledTouchableOpacity>
  );
};

export { DeviceKnownListItem };
