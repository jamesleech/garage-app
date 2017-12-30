import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';
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

const StyledSwitch = styled.Switch`
  margin-left: auto;
`;

class OpenDoorScreen extends React.Component {
  onPressDevice = (device) => {
    console.log(`onPressDevice: ${device.id} - ${device.name}`);
  };

  render() {
    const { bluetoothPower, devices } = this.props;
    return (
      <TabContainer>
        <RowBluetooth on={ bluetoothPower }/>
        <DeviceKnownList devices={devices} onPressDevice={this.onPressDevice}/>
    </TabContainer>)
  }
}

function mapStateToProps(state) {
  return {
    bluetoothPower: state.ble.on,
    devices: state.ble.knownDevices.toList().toJS(),
  }
}

OpenDoorScreen = connect(
  mapStateToProps
)(OpenDoorScreen);

export { OpenDoorScreen };
