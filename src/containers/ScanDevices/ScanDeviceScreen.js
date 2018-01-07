import React from 'react';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  bleScanStart,
  bleScanStop,
} from '../../store/modules/ble';
import { startLinkDevice } from '../../store/modules/linkDevice';
import {
  DeviceScanButton,
  DeviceList,
  TabContainer,
  RowView,
  RowText,
  RowRightItem,
  RowBluetooth,
  DeviceStatus,
} from '../../components';

class ScanDevicesScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    return {
      tabBarLabel: 'Scan',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-add' : 'ios-add-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    }
  };

  onLinkDevice = (device) => {
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

function mapStateToProps(state) {
  return {
    bluetoothPower: state.ble.on,
    scanning: state.ble.scanning,
    devices: state.ble.devices.toList().toJS(),
    selectedDevice: state.ble.selectedDevice,
  };
}

ScanDevicesScreen = connect(
  mapStateToProps,
  {
    startScan: bleScanStart,
    stopScan: bleScanStop,
    linkDevice: startLinkDevice,
  }
)(ScanDevicesScreen);

export { ScanDevicesScreen };
