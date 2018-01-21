// @flow
import React from 'react';
import type { Node } from 'react';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native/index';
import { CommonInput, CommonButton, DeviceStatus } from '../../components';
import { linkDevice } from '../../store';
import type { ActionFunc, LinkDevicePayload, BleDevice } from '../../store';

const Wrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #2980b9;
  padding: 20px;
`;

const DeviceName = styled.Text`
  color: white;
`;

type LinkDeviceViewProps = { children: Node }
const LinkDeviceView = ({ children }: LinkDeviceViewProps) => (
    <Wrapper behavior='padding'>
      <StatusBar barStyle='dark-content' />
      {children}
    </Wrapper>
  );

type Props = {
  device: BleDevice;
  doLink: ActionFunc<LinkDevicePayload>;
}

type State = {
  alias: string;
  deviceKey: string;
}

class LinkDeviceScreen extends React.Component<Props, State> {

  static navigationOptions = () => ({
    title: `Link`,
  });

  static mapStateToProps = (state) => ({
    device: state.linkDevice.device,
  });

  static mapDispatchToProps = {
    doLink: linkDevice.request
  };

  deviceKey: ?CommonInput;

  doLinkDevice = () => {
    const { device, doLink } = this.props;
    device.alias = this.state.alias;
    device.key = this.state.deviceKey;
    console.log(`doLinkDevice: ${JSON.stringify(device)}`);
    doLink({device});
  };

  render() {
    const { device } = this.props;
    return (
      <LinkDeviceView>
        <DeviceName>{device.name}</DeviceName>
        <DeviceStatus status={device.status}/>
        <CommonInput
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='next'
          placeholder='alias'
          placeholderTextColor='rgba(255,255,255,0.5)'
          onSubmitEditing={() => this.deviceKey && this.deviceKey.focus()}
          onChangeText={alias => this.setState({alias})}
        />
        <CommonInput
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='go'
          placeholder='device key'
          placeholderTextColor='rgba(255,255,255,0.5)'
          innerRef={input => { this.deviceKey = input; }}
          onChangeText={deviceKey => this.setState({deviceKey})}
        />
        <CommonButton
          label='Link Device'
          onPress={() => this.doLinkDevice()} />
      </LinkDeviceView>
    );
  }
}

const screen = connect(LinkDeviceScreen.mapStateToProps,LinkDeviceScreen.mapDispatchToProps)(LinkDeviceScreen);

export { screen as LinkDeviceScreen };
