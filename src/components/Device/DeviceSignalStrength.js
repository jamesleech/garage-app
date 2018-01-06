import React from 'react';
import {
  RowView,
  RowText,
} from '../index';

const DeviceSignalStrength = ({ strength }) => {
  return (
    <RowView>
      <RowText>Signal Strength:</RowText>
      <RowText>{ strength ? strength : 'na' }</RowText>
    </RowView>
  );
};

export { DeviceSignalStrength };
