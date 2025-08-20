import React from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './styles';
import { routes } from '../constants';

const Stack = createNativeStackNavigator();

function NavigationWrapper() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <NavigationContainer>
          {
            Platform.OS === 'ios' ? <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> : null
          }
          <Stack.Navigator initialRouteName="Splash">
            {(routes || []).map(route => (
              <Stack.Screen
                key={route.name}
                options={route.options}
                name={route.name}
                component={route.component}
              />
            ))}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default NavigationWrapper;
