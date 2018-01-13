import React, {Component} from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { DeviceKnownListItem } from './index';

const StyledView = styled.View`
  flex: 1;
  margin-top: 6px;
  width: 100%;
`; // #2980b9

class DeviceKnownList extends Component {
  keyExtractor = (device) => device.id;

  render() {
    const { devices, onPressDevice, onRemoveDevice } = this.props;
    return (
      <StyledView>
        <FlatList
          data={ devices }
          keyExtractor={this.keyExtractor}
          renderItem={({item}) =>
            <DeviceKnownListItem
              item={item}
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
