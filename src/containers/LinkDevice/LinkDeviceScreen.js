import React from 'react';
import { connect } from 'react-redux';
import { bleScanStart, bleScanStop, bleDeviceSelected } from '../../store/modules/ble';
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
import styled from 'styled-components/native/index';

class LinkDeviceScreen extends React.Component {

  onPressDevice = (device) => {
    const { selectDevice } = this.props;
    selectDevice({ id: device.id });
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
          <DeviceStatus status='unconnected' />
        </RowRightItem>
      </RowView>
      <DeviceScanButton scanning={scanning} startScanning={startScan} stopScanning={stopScan} />
      <DeviceList scanning={scanning} devices={devices} onPressDevice={this.onPressDevice}/>
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
    selectDevice: bleDeviceSelected,
  }
)(LinkDeviceScreen);

export { LinkDeviceScreen };
