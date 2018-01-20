// @flow
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import Swipeout from 'react-native-swipeout';
import {
  RowText,
  DeviceStatus
} from '../index';
import type { ActionFunc } from '../../store/Action';
import type { BleDevice } from '../../store/ble';
import type { RemoveDevicePayload, ToggleDoorPayload } from '../../store/knownDevices/actions';


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
  device: BleDevice,
  onPress: ActionFunc<ToggleDoorPayload>,
  onRemove: ActionFunc<RemoveDevicePayload>
}

const handlePress = (onPress, device) => () => {
  console.log(`DeviceKnownListItem.handlePress: ${device.id}`);
  onPress({device});
};

const handleRemove = (onRemove, device) => () => {
  console.log(`DeviceKnownListItem.handleRemove: ${device.id}`);
  onRemove({device});
};

const DeviceKnownListItem = ({device, onPress, onRemove}: Props) => {
  const disabled = device.status!=='connected';
  const removeBtn = {
    text: 'Remove',
    type: 'delete',
    onPress: handleRemove(onRemove, device),
  };

  return (
    <Swipeout backgroundColor='transparent' right={[removeBtn]} autoClose>
      <StyledTouchableOpacity onPress={handlePress(onPress, device)} disabled={disabled}>
        <View>
          <ItemView>
            <RowText>{device.alias || device.name}</RowText>
          </ItemView>
          <DeviceStatus status={device.status}/>
        </View>
      </StyledTouchableOpacity>
    </Swipeout>
  );
};

export { DeviceKnownListItem };
