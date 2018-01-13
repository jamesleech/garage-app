import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import {
  RowText,
  DeviceStatus
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

const handlePress = (onPress, item) => () => onPress(item);

const handleRemove = (onRemove, item) => () => onRemove(item);

const DeviceKnownListItem = ({item, onPress, onRemove}) => {
  const disabled = item.status!=='connected';
  const removeBtn = {
    text: 'Remove',
    type: 'delete',
    onPress: handleRemove(onRemove, item),
  };

  return (
    <Swipeout backgroundColor='transparent' right={[removeBtn]} autoClose>
      <StyledTouchableOpacity onPress={handlePress(onPress, item)} disabled={disabled}>
        <View>
          <ItemView>
            <RowText>{item.alias || item.name}</RowText>
          </ItemView>
          <DeviceStatus status={item.status}/>
        </View>
      </StyledTouchableOpacity>
    </Swipeout>
  );
};

export { DeviceKnownListItem };
