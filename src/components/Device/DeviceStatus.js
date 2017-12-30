import React, { Component } from 'react';
import styled from 'styled-components/native';

const StyledText = styled.Text`
  color: white;
`;


class DeviceStatus extends Component {
  renderGraphic = () => {
    switch (this.props.status) {
      case 'connected':
        return (
          <StyledText>Connected</StyledText>
        );
      case 'unconnected':
        return (
          <StyledText>Unconnected</StyledText>
        );
      case 'connecting':
        return (
          <StyledText>Connecting</StyledText>
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
      this.renderGraphic()
    );
  }
}

export { DeviceStatus };

