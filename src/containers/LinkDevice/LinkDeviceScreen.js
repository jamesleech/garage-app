import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';

class LinkDeviceScreen extends React.Component {
  render() {
    return (
      <Text>Link Device Screen</Text>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

LinkDeviceScreen = connect(
  mapStateToProps,
  { }
)(LinkDeviceScreen);

export { LinkDeviceScreen };
