import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import {
  RowText,
  DeviceSignalStrength
} from '../index';

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

const DeviceListItem = ({ item, onLinkPress }) => {
  const pressed = () => {
    onLinkPress(item);
  };

  return (
    <StyledTouchableOpacity onPress={pressed}>
      <View>
        <ItemView>
          <RowText>{item.name || item.id}</RowText>
        </ItemView>
        <DeviceSignalStrength strength={item.rssi}/>
      </View>
    </StyledTouchableOpacity>
  );
};

export { DeviceListItem };
