import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import Swipeout from 'react-native-swipeout';
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

const handlePress = (onPress, item) => {
  return () => onPress(item);
};

const handleRemove = (onRemove, item) => {
  return () => onRemove(item);
};

const DeviceKnownListItem = ({item, onPress, onRemove}) => {

  const disabled = item.status!=='connected';

  const removeBtn = {
    text: 'Remove',
    type: 'delete',
    onPress: handleRemove(onRemove, item),
  };

  return (
    <Swipeout autoClose={true} backgroundColor= 'transparent' right={[removeBtn]}>
      <StyledTouchableOpacity onPress={handlePress(onPress, item)} disabled={disabled}>
        <View>
          <ItemView>
            <RowText>{item.name}</RowText>
          </ItemView>
          <DeviceStatus status={item.status}/>
          <DeviceSignalStrength strength = {item.rssi}/>
        </View>
      </StyledTouchableOpacity>
    </Swipeout>
  );
};

export { DeviceKnownListItem };
