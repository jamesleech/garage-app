// @flow
import React, { Component } from 'react';
import styled from 'styled-components/native';
import { RowView } from '../index';

const StyledText = styled.Text`
  color: white;
`;

type props = {
  status: string
};

class DeviceStatus extends Component<props> {
  renderGraphic = () => {
    switch (this.props.status) {
      case 'connected':
        return (
          <StyledText>Connected</StyledText>
        );
      case 'notConnected':
        return (
          <StyledText>Not connected</StyledText>
        );
      case 'connecting':
        return (
          <StyledText>Connecting...</StyledText>
        );
      case 'disconnecting':
        return (
          <StyledText>Disconnecting...</StyledText>
        );
      default:
        return (
          <StyledText>TODO: {this.props.status}</StyledText>
        );
      // Add more icons here
    }
  };

  render() {
    return (
      <RowView>
        {this.renderGraphic()}
      </RowView>
    );
  }
}

export { DeviceStatus };

