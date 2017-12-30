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
  RowBluetooth,
  GarageStatus
} from '../../components';

const StyledSwitch = styled.Switch`
  margin-left: auto;
`;

class OpenDoorScreen extends React.Component {
  render() {
    const { bluetoothPower } = this.props;
    return (
      <TabContainer>
        <RowBluetooth on={ bluetoothPower }/>
        <RowView>
          <RowText>Device</RowText>
          <RowRightItem>
            <DeviceStatus status='connected' />
          </RowRightItem>
        </RowView>
        <RowView>
          <RowText>Garage</RowText>
          <RowRightItem>
            <GarageStatus status='occupied' />
          </RowRightItem>
        </RowView>
        <RowSwitch text='Control Door' />
    </TabContainer>)
  }
}

function mapStateToProps(state) {
  return {
    bluetoothPower: state.ble.on,
  }
}

OpenDoorScreen = connect(
  mapStateToProps
)(OpenDoorScreen);

export { OpenDoorScreen };
