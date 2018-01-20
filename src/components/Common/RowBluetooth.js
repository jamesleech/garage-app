// @flow
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RowView, RowRightItem, RowText } from './index';

type Props = {
  on: boolean;
}

const RowBluetooth = ( { on }: Props) => (
    <View>
      {!on
        ?
        <RowView>
          <RowText>Bluetooth</RowText>
          <RowRightItem>
            <ActivityIndicator color='white'/>
          </RowRightItem>
        </RowView>
        : <View/>
      }
    </View>
  );


export { RowBluetooth };
