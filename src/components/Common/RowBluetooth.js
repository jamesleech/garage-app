import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { RowView, RowRightItem, RowText } from './index';

const RowBluetooth = ( { on }) => (
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
