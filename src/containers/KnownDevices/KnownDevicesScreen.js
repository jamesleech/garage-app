import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import styled from "styled-components/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TabContainer,
  DeviceKnownList,
  RowBluetooth,
} from '../../components';
import { removeDevice, toggleDoor } from '../../store/modules/knownDevices';

const StyledSwitch = styled.Switch`
  margin-left: auto;
`;

class KnownDevicesScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      tabBarLabel: 'Devices',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    }
  };

  onPressDevice = (device) => {
    const { toggleDoor } = this.props;
    toggleDoor({ id: device.id });
  };

  onRemoveDevice = (device) => {
    Alert.alert(
      'Remove Device',
      'Removing the linked device will also remove it\'s key',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: () => {
            const { removeDevice } = this.props;
            removeDevice(device);
          }
        }
      ]);
  };

  render() {
    const { bluetoothPower, devices } = this.props;
    return (
      <TabContainer>
        <RowBluetooth on={ bluetoothPower }/>
        <DeviceKnownList
          devices={devices}
          onPressDevice={this.onPressDevice}
          onRemoveDevice={this.onRemoveDevice} />
    </TabContainer>)
  }
}

function mapStateToProps(state) {
  return {
    bluetoothPower: state.ble.on,
    devices: state.knownDevices.devices.toList().toJS(),
  }
}

KnownDevicesScreen = connect(
  mapStateToProps,
  {
    toggleDoor: toggleDoor,
    removeDevice: removeDevice
  }
)(KnownDevicesScreen);

export { KnownDevicesScreen };
