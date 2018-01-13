import React from 'react';
import {
  RowView,
  RowText,
} from '../index';

const DeviceSignalStrength = ({ strength }) => (
    <RowView>
      <RowText>Signal Strength:</RowText>
      <RowText>{ strength || 'na' }</RowText>
    </RowView>
  );

export { DeviceSignalStrength };
