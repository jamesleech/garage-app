import React from 'react';
import styled from 'styled-components/native';
import { View } from "react-native";
import { RowView, RowText } from '../Common';

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

const DeviceListItem = ({ item, onPress }) => {
  const pressed = () => {
    onPress(item);
  };

  return (
    <StyledTouchableOpacity onPress={pressed}>
      <View>
        <ItemView>
          <RowText>{item.name}</RowText>
        </ItemView>
        <ItemView>
          <RowText>{item.id}</RowText>
        </ItemView>
        <ItemView>
          <RowText>Signal Strength:</RowText>
          <RowText>{item.rssi}</RowText>
        </ItemView>
        { item.serviceUUIDs
        ? <ItemView>
            <RowText>Services:</RowText>
            <RowText>{item.serviceUUIDs.length}</RowText>
          </ItemView>
        : <View/>
        }
      </View>
      <ItemDivider />
    </StyledTouchableOpacity>
  );
};

export { DeviceListItem };
