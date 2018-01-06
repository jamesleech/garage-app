import React, {Component} from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { RowView, RowText } from '../Common';
import { DeviceListItem } from './index';

const StyledView = styled.View`
  flex: 1;
  margin-top: 6px;
  width: 100%;
`; //#2980b9
const ActivityIndicatorWrapper = styled.View`
  padding-left: 10px;
`;

class DeviceList extends Component {
  keyExtractor = (device, index) => {
    return device.id || device.uuid;
  };

  render() {
    const { scanning, devices, onLinkDevice } = this.props;
    return (
      <StyledView>
        <RowView>
          <RowText>Found {devices.length}
            {devices.length === 1
              ? ' device'
              : ' devices'
            }
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
          renderItem={({item}) => <DeviceListItem item={item} onLinkPress={onLinkDevice}/>}
        />
      </StyledView>
    );
  }
}

export { DeviceList };
