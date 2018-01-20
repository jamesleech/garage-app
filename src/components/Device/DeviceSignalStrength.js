// @flow
import React from 'react';
import {
  RowView,
  RowText,
} from '../index';

type props = {
  strength: string;
}

const DeviceSignalStrength = ({ strength }: props) => (
    <RowView>
      <RowText>Signal Strength:</RowText>
      <RowText>{ strength || 'na' }</RowText>
    </RowView>
  );

export { DeviceSignalStrength };
