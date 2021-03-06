// @flow
import { StackNavigator } from "react-navigation";
import {
  SplashScreen,
  SignInScreen,
  HomeScreen,
  LinkDeviceScreen,
} from './containers';

const AppNavigator = StackNavigator({
  Splash: {
    screen: SplashScreen
  },
  SignIn: {
    screen: SignInScreen
  },
  Home: {
    screen: HomeScreen,
  },
  LinkDevice: {
    screen: LinkDeviceScreen,
  }
});

export { AppNavigator };
