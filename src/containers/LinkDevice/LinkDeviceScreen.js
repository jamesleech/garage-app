import React from 'react';
import { connect } from 'react-redux';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native/index';
import { CommonInput, CommonButton } from '../../components';
import { linkDevice } from '../../store/modules/linkDevice';

const Wrapper = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: #2980b9;
  padding: 20px;
`;

const LinkDeviceView = ({ children }) => (
    <Wrapper behavior='padding'>
      <StatusBar barStyle='dark-content' />
      {children}
    </Wrapper>
  );

class LinkDeviceScreen extends React.Component {

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      title: `${params.device.name}`,
    };
  };

  doLinkDevice = () => {
    const { params = {} } = this.props.navigation.state;
    const { device } = params;
    const { doLink } = this.props;

    device.alias = this.state.alias;
    device.key = this.state.deviceKey;
    console.log(`Link Device: ${JSON.stringify(device)}`);

    doLink(device);
  };

  render() {
    return (
      <LinkDeviceView>
        <CommonInput
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='next'
          placeholder='alias'
          placeholderTextColor='rgba(255,255,255,0.5)'
          onSubmitEditing={() => this.deviceKey.focus()}
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

const screen = connect(null,
  {
    doLink: linkDevice
  }
)(LinkDeviceScreen);

export { screen as LinkDeviceScreen };
