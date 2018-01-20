// @flow
import React, {Component} from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { RowView, RowText } from '../Common';
import { DeviceListItem } from './index';
import type { ActionFunc, BleDevice } from '../../store';

const StyledView = styled.View`
  flex: 1;
  margin-top: 6px;
  width: 100%;
`; // #2980b9
const ActivityIndicatorWrapper = styled.View`
  padding-left: 10px;
`;

type props = {
  scanning: boolean;
  devices: Array<BleDevice>;
  onLinkDevice: ActionFunc<BleDevice>;
}

class DeviceList extends Component<props> {
  keyExtractor = (device: BleDevice) => device.id;

  foundText = (length: number) => `Found ${length} ${length === 1 ? 'device' : 'devices'}`;

  render() {
    const { scanning, devices, onLinkDevice } = this.props;
    return (
      <StyledView>
        <RowView>
          <RowText>{this.foundText(devices.length)}
          </RowText>
          {scanning
            ?
            <ActivityIndicatorWrapper>
              <ActivityIndicator color='white'/>
            </ActivityIndicatorWrapper>
            :
            <View/>
          }
        </RowView>
        <FlatList
          data={ devices }
          keyExtractor={this.keyExtractor}
          renderItem={({item}) => <DeviceListItem device={item} onLinkPress={onLinkDevice}/>}
        />
      </StyledView>
    );
  }
}

export { DeviceList };
