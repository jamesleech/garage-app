// @flow
import React from 'react';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  DeviceScanButton,
  DeviceList,
  TabContainer,
  RowBluetooth,
} from '../../components';
import {
  bleScanStart,
  bleScanStop,
  startLinkDevice,
} from '../../store';
import type {
  ActionFunc,
  BleDevice,
  LinkDevicePayload,
} from '../../store';

type Props = {
  linkDevice: ActionFunc<LinkDevicePayload>;
  bluetoothPower: boolean;
  startScan: ActionFunc<>;
  stopScan: ActionFunc<>;
  scanning: boolean;
  devices: Array<BleDevice>;
}

class ScanDevicesScreen extends React.Component<Props> {

  static navigationOptions = () => ({
    tabBarLabel: 'Scan',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-add' : 'ios-add-outline'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  });

  static mapStateToProps = (state) => ({
      bluetoothPower: state.ble.on,
      scanning: state.ble.scanning,
      devices: state.ble.devices.toList().toJS(),
      selectedDevice: state.ble.selectedDevice,
  });

  static mapDispatchToProps = {
    startScan: bleScanStart.request,
    stopScan: bleScanStop.request,
    linkDevice: startLinkDevice.request,
  };

  onLinkDevice = (device: BleDevice) => {
    const { linkDevice } = this.props;
    linkDevice({ device });
  };

  render() {
    const {
      bluetoothPower,
      startScan,
      stopScan,
      scanning,
      devices
    } = this.props;

    return (
    <TabContainer>
      <RowBluetooth on={ bluetoothPower }/>
      <DeviceScanButton scanning={scanning} startScanning={startScan} stopScanning={stopScan} />
      <DeviceList scanning={scanning} devices={devices} onLinkDevice={this.onLinkDevice}/>
    </TabContainer>
    );
  }
}

const screen = connect(ScanDevicesScreen.mapStateToProps, ScanDevicesScreen.mapDispatchToProps)(ScanDevicesScreen);

export { screen as ScanDevicesScreen };
