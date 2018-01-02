import {
  bleUpdateState,
  bleScanStop,
  bleDeviceConnect,
  bleDeviceDisconnect,
  bleDeviceFound,
} from './actions';

import {
  AppState,
  NativeModules,
  Platform,
  PermissionsAndroid,
  NativeEventEmitter,
} from 'react-native';
import BleManager from 'react-native-ble-manager';

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);

export class BleWrapper {

  constructor(channel) {
    this.appState = '';
    this.scanning = false;
    this.channel = channel;
  }

  start = async () => {
    await this.androidBluetoothPermission();
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

  androidBluetoothPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const result = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);

      if (result) {
        console.log("Permission is OK");
      } else {
        const permission = await PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        if (permission) {
          console.log("User accept");
        } else {
          console.log("User refuse");
        }
      }
    }
  };

  stop = () => {
    this.listenerUpdateState.remove();
    this.listenerConnect.remove();
    this.listenerDiscover.remove();
    this.listenerStopScan.remove();
    this.listenerDisconnect.remove();
    this.listenerUpdate.remove();
  };

  startScan = async (uuids, seconds) => {
    if (!this.scanning) {
      console.log('Scanning...');
      this.scanning = true;
      const result = await BleManager.scan(uuids, seconds, true);
      console.log(`startScan results ${result}`);
    } else {
      console.log('Already scanning...');
    }
    //TODO: message start scanning success
  };

  stopScan = async () => {
    if(this.scanning) {
      console.log('stopScan: Attempting to stop scanning...');
      await BleManager.stopScan();
      this.scanning = false;
      console.log('stopScan: putting scan stop success');
      this.channel.put(bleScanStop.success());
      console.log('Scanning stopped...');
    } else {
      console.log('Already not Scanning...');
    }
  };

  connect = async (id) => {
    return await BleManager.connect(id);
  };

  disconnect = async (id) => {
    return await BleManager.disconnect(id);
  };

  getServicesForDeviceId = async (id) => {
    return await BleManager.retrieveServices(id);
  };

  write = async (id, serviceUUID, characteristicUUID, data) => {
    return await BleManager.write(id, serviceUUID, characteristicUUID, data);
  };

  handleUpdateState = ( { state } ) => {
    console.log(`handleUpdateState ${state}`);
    this.channel.put(bleUpdateState.success(state));
  };

  handleDiscoverPeripheral = ( { id, name, rssi }) => {
    //message discovered peripheral
    this.channel.put(bleDeviceFound.success({ id, name, rssi }));
  };

  handleStopScan = () => {
    console.log('Scan timed out');
    this.scanning = false;
    this.channel.put(bleScanStop.success());
  };

  handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from '
      + data.peripheral
      + ' characteristic '
      + data.characteristic, data.value);
    // TODO: message value
  };

  handleConnectPeripheral = (data) => {
    console.log(`handleConnectPeripheral: Connected to ${JSON.stringify(data)}`);
    this.channel.put(bleDeviceConnect.success({ id: data.peripheral }));
  };

  handleDisconnectedPeripheral = (data) => {
    console.log(`Disconnected from ${JSON.stringify(data)}`);
    this.channel.put(bleDeviceDisconnect.success({ id: data.peripheral }));
    // TODO: message that peripheral disconnected
  };

  handleAppStateChange = async (nextAppState) => {
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

//   constructor(channel) {
//     this.channel = channel;
//     this.stateChangedSubscription = {};
//   }
//
//   // highlander the BleManager
//   ble = () => {
//     if(_ble === undefined) {
//       console.log('_bleManager was undefined, creating new BleManager');
//       _ble = new BleManager();
//     }
//     return _ble;
//   };
//
//   handleActions = (action) => {
//     console.log(`BLEWrapper received action: ${action.type}, ${action.payload}`);
//   };
//
//   createBleSaga = (state) => {
//     return {
//       // this will be used to resolve take Effects, only does StateChange events
//       subscribe: (callback) => {
//         // subscribe
//         console.log('setting onStateChange handler');
//         if(_ble === undefined) {
//           _ble = new BleManager();
//         }
//
//         // this isn't quick enough, BleManager sending first state event before connecting the handler
//         this.stateChangedSubscription = _ble.onStateChange((newState) => {
//           callback({type: bleUpdateState.REQUEST, payload: newState} );
//         });
//
//         // return unsubscribe function
//         return () => {
//           this.stateChangedSubscription.remove();
//         }
//       },
//
//       // this will be used to resolve put Effects
//       dispatch: (action) => {
//         this.handleActions(action);
//       },
//
//       // this will be used to resolve select Effects
//       getState: state
//     };
//   };
//
//   discoverDevice = (deviceId) => {
//     console.log(`discoverDevice: ${deviceId}`);
//
//     return new Promise((resolve, reject) => {
//       this.ble().connectToDevice(deviceId)
//         .then((device) => {
//           console.log(`discoverDevice: connected to device.`);
//           return new Promise.resolve({
//             device,
//             device.discoverAllServicesAndCharacteristics();
//           });
//         })
//         .then((detailedDevice) => {
//           console.log(`discoverDevice: got detailed Device. (${detailedDevice.name})`);
//           // Do work on device with services and characteristics
//           resolve(detailedDevice);
//         })
//         .catch((error) => {
//           console.error(error);
//           reject(error);
//         });
//     });
//   };
//
//   createScanningChannel = () => {
//     return eventChannel(emit => {
//
//       const deviceFoundHandler = (device) => {
//         // puts event payload into the channel
//         // this allows a Saga to take this payload from the returned channel
//         try {
//           if(device.id && emit) {
//             emit(device);
//           }
//         } catch (err) {
//           console.error(err);
//         }
//       };
//
//       this.ble().startDeviceScan(SERVICE_UUIDS, null, (error, device) => {
//         if (error) {
//           console.error(error);
//           if(emit) {
//             emit(END);
//           }
//         } else {
//          deviceFoundHandler(device);
//         }
//       });
//
//       return () => {
//         this.ble().stopDeviceScan();
//       };
//     });
//   };
//
// //   getBleManager().startDeviceScan(null, null, (error, device) => {
// //     if (error) {
// //       console.log(`startDeviceScan error: ${error}`);
// //       bleManager.stopDeviceScan();
// //     } else {
// //       foundDevice(device);
// //     }
// //   });
// // }
//
// }
//
// //
// // const foundDevice = device => {
// //   console.log(`startDeviceScan device: ${device.uuid}`);
// //   console.log(`startDeviceScan device: ${device.name}`);
// //   console.log(`startDeviceScan device: ${device.rssi}`);
// //   console.log(`startDeviceScan device: ${device.isConnectable}`);
// // };
//
//
//
