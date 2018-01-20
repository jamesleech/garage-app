// @flow
import React from 'react';
import { connect } from 'react-redux';
import { TabNavigator } from 'react-navigation';
import type { NavigationContainer } from 'react-navigation';
import { ScanDevicesScreen, KnownDevicesScreen } from '../index';
import { StatusBarWrapper } from '../../components';

type Props = {
  username: string;
  navigation: any; // TODO:
}

let HomeScreenNavigator: NavigationContainer<*,*,*>;

class HomeScreen extends React.Component<Props> {

  static router: any; // TODO:

  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    console.log(`HomeScreen.navigationOptions: params ${JSON.stringify(params)}`);
    return {
      title: `${params.username}' Garage`,
      headerLeft: null
    };
  };

  static mapStateToProps = (state) => ({
    username: state.signIn.username,
    linkedDevice: state.ble.linkedDevice,
  });

  constructor() {
    super();
    HomeScreenNavigator = TabNavigator({
      Open: { screen: KnownDevicesScreen },
      Link: { screen: ScanDevicesScreen },
    });
    // this TabNavigator needs it's router set to its parent's router to be a sub element.
    // the TabNavigator needs to be a sub element so the StatusBar can be changed to dark-content
    HomeScreenNavigator.router = HomeScreen.router;
  }

  // componentDidMount() {
  //   // grab the username from the store
  //   // give it to the navigator so that it can be used in navigationOptions above
  //   this.props.navigation.setParams({
  //     username: this.props.username
  //   });
  // }

  render() {
    return (
      <StatusBarWrapper>
        <HomeScreenNavigator />
      </StatusBarWrapper>
    );
  }
}

const screen = connect(HomeScreen.mapStateToProps, {})(HomeScreen);
export { screen as HomeScreen };
