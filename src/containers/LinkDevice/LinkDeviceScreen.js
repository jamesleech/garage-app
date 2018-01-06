import React from 'react';
import { connect } from 'react-redux';
import {
  bleScanStart,
  bleScanStop,
  bleDeviceLink
} from '../../store/modules/ble';
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

class LinkDeviceScreen extends React.Component {

  onLinkDevice = (device) => {
    const { linkDevice } = this.props;
    linkDevice({ id: device.id, key: device.key });
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
      <RowView>
        <RowText>Device</RowText>
        <RowRightItem>
          <DeviceStatus status='notConnected' />
        </RowRightItem>
      </RowView>
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

LinkDeviceScreen = connect(
  mapStateToProps,
  {
    startScan: bleScanStart,
    stopScan: bleScanStop,
    linkDevice: bleDeviceLink,
  }
)(LinkDeviceScreen);

export { LinkDeviceScreen };
