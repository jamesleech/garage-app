import React from 'react';
import { StackNavigator } from "react-navigation";
import {
  SplashScreen,
  SignInScreen,
  HomeScreen
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
    }
  }
);

export { AppNavigator };
