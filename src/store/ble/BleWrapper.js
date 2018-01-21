// @flow
  // Platform,
  // PermissionsAndroid,
// import type { EmitterSubscription } from 'react-native';
import { AppState, NativeModules, NativeEventEmitter } from 'react-native';
import type { Channel } from "redux-saga";
import BleManager from 'react-native-ble-manager';
import {
  bleUpdateState,
  bleScanStop,
  bleDeviceConnect,
  bleDeviceDisconnect,
  bleDeviceFound, bleScanStart,
} from './actions';
import type { BleDevice } from './actions';

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

type BleUpdateState = {
  state: string;
};

type BleUpdateValueForCharacteristic = {
  peripheral: string; // the id of the peripheral
  characteristic: string;  // the UUID of the characteristic
  value: Array<any>; // the read value
}

type BlePeripheral = {
  peripheral: string;
}

export type WriteCommand = {
  id: string,
  serviceUuid: string,
  characteristicUuid: string,
  data: Array<number>
}

export class BleWrapper {
  appState: string;
  scanning: boolean;
  channel: Channel;

  // TODO: EmitterSubscription
  listenerUpdateState: any;
  listenerConnect: any;
  listenerDiscover: any;
  listenerStopScan: any;
  listenerDisconnect: any;
  listenerUpdate: any;

  // listenerUpdateState: EmitterSubscription;
  constructor(channel: Channel) {
    this.appState = '';
    this.scanning = false;
    this.channel = channel;
  }

  start = async () => {
    // await this.androidBluetoothPermission();
    AppState.addEventListener('change', this.handleAppStateChange);
    const result = await BleManager.start({showAlert: true});

    this.listenerUpdateState = bleManagerEmitter.addListener('BleManagerDidUpdateState', this.handleUpdateState);
    this.listenerConnect = bleManagerEmitter.addListener('BleManagerConnectPeripheral', this.handleConnectPeripheral);
    this.listenerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
    this.listenerStopScan = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
    this.listenerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral);
    this.listenerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);

    BleManager.checkState(); // will trigger a BleManagerDidUpdateState

    return result;
  };

  // androidBluetoothPermission = async () => {
  //   if (Platform.OS === 'android' && Platform.Version >= 23) {
  //     const result = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
  //
  //     if (result) {
  //       console.log("Permission is OK");
  //     } else {
  //       const permission = await PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
  //       if (permission) {
  //         console.log("User accept");
  //       } else {
  //         console.log("User refuse");
  //       }
  //     }
  //   }
  // };

  stop = () => {
    this.listenerUpdateState.remove();
    this.listenerConnect.remove();
    this.listenerDiscover.remove();
    this.listenerStopScan.remove();
    this.listenerDisconnect.remove();
    this.listenerUpdate.remove();
  };

  startScan = async (uuids: string[] | null, seconds: number) => {
    if (!this.scanning) {
      console.log('Scanning...');
      this.scanning = true;
      await BleManager.scan(uuids, seconds, false);
    } else {
      console.log('Already scanning...');
    }
    // TODO: message start scanning success
    this.channel.put(bleScanStart.success({}));
  };

  stopScan = async () => {
    if(this.scanning) {
      console.log('stopScan: Attempting to stop scanning...');
      await BleManager.stopScan();
      this.scanning = false;
      console.log('stopScan: putting scan stop success');
      this.channel.put(bleScanStop.success());
      console.log('Scanning stopped');
    } else {
      console.log('Already not Scanning');
    }
  };

  connect = async (id: string) => {
    const isConnected = await BleManager.isPeripheralConnected(id, []);
    console.log(`bleWrapper.connect: ${id} isConnected: ${isConnected}`);
    // if(isConnected) {
    //   this.channel.put(bleDeviceConnect.success({ id }));
    // } else {
      BleManager.connect(id);
    // }
  };

  disconnect = async (id: string) => {
    try {
      const isConnected = await BleManager.isPeripheralConnected(id, []);
      if(isConnected) {
        return await BleManager.disconnect(id);
      }
    } catch (error) {
      console.log(`disconnect error ${error}`);
    }
    return undefined;
  };

  getServicesForDeviceId = async (id: string) => {
    const isConnected = await BleManager.isPeripheralConnected(id, []);
    if(isConnected) {
      return BleManager.retrieveServices(id);
    }
    return null;
  };

  getSignalStrength = async (id: string) => {
    try {
      const isConnected = await BleManager.isPeripheralConnected(id, []);
      if(isConnected) {
        return await BleManager.readRSSI(id);
      }
    } catch (error) {
      console.log(`getSignalStrength error ${error}`);
    }
    return 0;
  };

  write = async ({id, serviceUuid, characteristicUuid, data}: WriteCommand) =>
    BleManager.write(id, serviceUuid, characteristicUuid, data);

  handleUpdateState = ( { state }: BleUpdateState ) => {
    console.log(`bleWrapper.handleUpdateState: ${state}`);
    this.channel.put(bleUpdateState.success({ state }));
  };

  handleDiscoverPeripheral = ( { id, name, rssi}: BleDevice) => {
    // message discovered peripheral
    const device: BleDevice = { id, name, rssi };
    this.channel.put(bleDeviceFound.success({device}));
  };

  handleStopScan = () => {
    console.log('Scan timed out');
    this.scanning = false;
    this.channel.put(bleScanStop.success());
  };

  handleUpdateValueForCharacteristic = (data: BleUpdateValueForCharacteristic) => {
    console.log(`Received data from ${
       data.peripheral
       } characteristic ${
       data.characteristic}`, data.value);
    // TODO: message value
  };

  handleConnectPeripheral = (data: BlePeripheral) => {
    console.log(`handleConnectPeripheral: Connected to ${JSON.stringify(data)}`);
    const device: BleDevice = { id: data.peripheral };
    this.channel.put(bleDeviceConnect.success({ device }));
  };

  handleDisconnectedPeripheral = (data: BlePeripheral) => {
    console.log(`Disconnected from ${JSON.stringify(data)}`);
    const device: BleDevice = { id: data.peripheral };
    this.channel.put(bleDeviceDisconnect.success({ device }));
    // TODO: message that peripheral disconnected
  };

  handleAppStateChange = async (nextAppState: string) => {
    if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      BleManager.checkState();

      // const peripheralsArray = await BleManager.getConnectedPeripherals([]);
      // console.log('Connected peripherals: ' + peripheralsArray.length);
      // //TODO: PUT connected peripherals
    }
    this.appState = nextAppState;
  };
}
