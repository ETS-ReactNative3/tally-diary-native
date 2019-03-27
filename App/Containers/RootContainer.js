import React, { Component } from 'react'
import { View, StatusBar } from 'react-native'
import LaunchScreen from '../Containers/LaunchScreen'
import TimelineScreen from '../Containers/TimelineScreen'
import InitialLoadingScreen from '../Containers/InitialLoadingScreen'
import { createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation'

// Styles
import styles from './Styles/RootContainerStyles'

const DrawerNavigator = createDrawerNavigator({
  TimelineScreen: {
    screen: TimelineScreen,
  },
});


const AppNavigator = createStackNavigator(
  {
    LaunchScreen: LaunchScreen,
    InitialLoadingScreen: InitialLoadingScreen,
    DrawerNavigator: DrawerNavigator,
  },
  {
    initialRouteName: "LaunchScreen"
  },
);

const AppContainer = createAppContainer(AppNavigator);

class RootContainer extends Component {
  render () {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle='light-content' />
        <AppContainer />
      </View>
    )
  }
}

export default RootContainer;
