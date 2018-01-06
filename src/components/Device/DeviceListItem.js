import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import {
  RowView,
  RowText,
  DeviceSignalStrength
} from '../index';

const Wrapper = styled.View`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: row;
  padding-bottom: 6px;
`;

const ItemGroup = styled.View`
  width: 100%;
  background-color: #3498db;
  flex: 3;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const ItemView = styled.View`
  display: flex;
  flex:5;
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  margin: 4px 4px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const LinkTouchable = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex:1;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const LinkText = styled.Text`
  text-align: center;
  color: #3498db;
  font-weight: 700;
`;

const DeviceListItem = ({ item, onLinkPress }) => {
  const pressed = () => {
    onLinkPress(item);
  };

  return (
    <Wrapper>
      <ItemGroup>
        <ItemView>
          <RowText>{item.name}</RowText>
        </ItemView>
        <DeviceSignalStrength strength = {item.rssi}/>
      </ItemGroup>
      <LinkTouchable onPress={pressed}>
        <LinkText>Link</LinkText>
      </LinkTouchable>
    </Wrapper>
  );
};

export { DeviceListItem };
