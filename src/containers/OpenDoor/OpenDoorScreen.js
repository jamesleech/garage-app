import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View, Text } from 'react-native';
import styled from "styled-components/native";
import {
  TabContainer,
  RowView,
  RowSwitch,
  RowText,
  RowRightItem,
  DeviceStatus,
  DeviceKnownList,
  RowBluetooth,
  GarageStatus
} from '../../components';
import { bleToggleDoor } from '../../store/modules/ble';
import { removeDevice } from '../../store/modules/knownDevices';

const StyledSwitch = styled.Switch`
  margin-left: auto;
`;

class OpenDoorScreen extends React.Component {
  onPressDevice = (device) => {
    const { toggleDoor } = this.props;
    toggleDoor({ id: device.id });
  };

  onRemoveDevice = (device) => {
    const { removeDevice } = this.props;
    removeDevice(device);
  };

  render() {
    const { bluetoothPower, devices } = this.props;
    return (
      <TabContainer>
        <RowBluetooth on={ bluetoothPower }/>
        <Text>Known devices: {devices.length}</Text>
        <DeviceKnownList devices={devices} onPressDevice={this.onPressDevice} onRemoveDevice={this.onRemoveDevice} />
    </TabContainer>)
  }
}

function mapStateToProps(state) {
  return {
    bluetoothPower: state.ble.on,
    devices: state.knownDevices.devices.toList().toJS(),
  }
}

OpenDoorScreen = connect(
  mapStateToProps,
  {
    toggleDoor: bleToggleDoor,
    removeDevice: removeDevice
  }
)(OpenDoorScreen);

export { OpenDoorScreen };
