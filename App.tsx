import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Welcome from './src/modules/welcome/Welcome';
import Home from './src/modules/home/Home';
import AddNetVideo from './src/modules/home/AddNetVideo';
import VideoPlayer from './src/modules/video/VideoPlayer';
const Stack = createStackNavigator();

function App(): JSX.Element {
  return (
    <SafeAreaProvider style={{width: '100%', height: '100%'}}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            cardStyle: {elevation: 1},
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="AddNetVideo" component={AddNetVideo} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayer} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
