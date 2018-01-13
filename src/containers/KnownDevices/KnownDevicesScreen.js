import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TabContainer,
  DeviceKnownList,
  RowBluetooth,
} from '../../components';
import { removeDevice, toggleDoor } from '../../store/modules/knownDevices';

class KnownDevicesScreen extends React.Component {
  static navigationOptions = () => ({
      tabBarLabel: 'Devices',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-home' : 'ios-home-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    });

  onPressDevice = (device) => {
    const { onToggleDoor } = this.props;
    onToggleDoor({ id: device.id });
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
            const { onRemoveDevice } = this.props;
            onRemoveDevice(device);
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

const screen = connect(mapStateToProps,
  {
    onToggleDoor: toggleDoor.request,
    onRemoveDevice: removeDevice.request
  }
)(KnownDevicesScreen);

export { screen as KnownDevicesScreen };
