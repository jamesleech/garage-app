// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  TabContainer,
  DeviceKnownList,
  RowBluetooth,
} from '../../components';
import { removeDevice, toggleDoor } from '../../store';
import type {
  ActionFunc,
  BleDevice,
  RemoveDevicePayload,
  ToggleDoorPayload
} from '../../store';

type Props = {
  onRemoveDevice: ActionFunc<RemoveDevicePayload>;
  onToggleDoor: ActionFunc<ToggleDoorPayload>;
  bluetoothPower: boolean;
  devices: Array<BleDevice>;
}

class KnownDevicesScreen extends React.Component<Props> {
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

  static mapStateToProps = (state) => ({
    bluetoothPower: state.ble.on,
    devices: state.knownDevices.devices.toList().toJS(),
  });

  static mapDispatchToProps = {
    onToggleDoor: toggleDoor.request,
    onRemoveDevice: removeDevice.request
  };

  onPressDevice = (device: BleDevice) => {
    const { onToggleDoor } = this.props;
    onToggleDoor({ device });
  };

  onRemoveDevice = (device: BleDevice) => {
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
            onRemoveDevice={this.onRemoveDevice}/>
      </TabContainer>
    );
  }
}

const screen = connect(KnownDevicesScreen.mapStateToProps,KnownDevicesScreen.mapDispatchToProps)(KnownDevicesScreen);

export { screen as KnownDevicesScreen };
