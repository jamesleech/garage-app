import React, {Component} from 'react';
import { FlatList, View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { DeviceKnownListItem } from './index';

const StyledView = styled.View`
  flex: 1;
  margin-top: 6px;
  width: 100%;
`; //#2980b9

class DeviceKnownList extends Component {
  keyExtractor = (device, index) => {
    return device.id;
  };

  render() {
    const { devices, onPressDevice } = this.props;
    return (
      <StyledView>
        <FlatList
          data={ devices }
          keyExtractor={this.keyExtractor}
          renderItem={({item}) =>
            <DeviceKnownListItem
              item={item}
              onPress={onPressDevice}
            />
          }
        />
      </StyledView>
    );
  }
}

export { DeviceKnownList };
