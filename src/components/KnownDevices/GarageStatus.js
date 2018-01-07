import React, { Component } from 'react';
import styled from 'styled-components/native';

const StyledText = styled.Text`
  color: white;
`;

class GarageStatus extends Component {
  renderGraphic = () => {
    switch (this.props.status) {
      case 'occupied':
        return (
          <StyledText>Occupied</StyledText>
        );
      case 'unoccupied':
        return (
          <StyledText>unoccupied</StyledText>
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

export { GarageStatus };

