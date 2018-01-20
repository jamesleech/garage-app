// @flow
import React, {Component} from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { DeviceKnownListItem } from './index';
import type {
  ActionFunc,
  BleDevice,
  RemoveDevicePayload,
  ToggleDoorPayload
} from '../../store';

const StyledView = styled.View`
  flex: 1;
  margin-top: 6px;
  width: 100%;
`; // #2980b9

type Props = {
  devices: Array<BleDevice>;
  onPressDevice: ActionFunc<ToggleDoorPayload>,
  onRemoveDevice: ActionFunc<RemoveDevicePayload>
}

class DeviceKnownList extends Component<Props> {
  keyExtractor = (device: BleDevice) => device.id;

  render() {
    const { devices, onPressDevice, onRemoveDevice } = this.props;
    return (
      <StyledView>
        <FlatList
          data={devices}
          keyExtractor={this.keyExtractor}
          renderItem={({item}) =>
            <DeviceKnownListItem
              device={item}
              onPress={onPressDevice}
              onRemove={onRemoveDevice}
            />
          }
        />
      </StyledView>
    );
  }
}

export { DeviceKnownList };
