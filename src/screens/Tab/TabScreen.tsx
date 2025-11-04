import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { tabItems } from '../../constants';

const Tab = createBottomTabNavigator();

// Tabs come from dedicated tab sources
const tabs = tabItems;

function CustomTabBarButton({ children, onPress, onLongPress, opacity }) {
  return (
    <TouchableOpacity
      style={[styles.tabBarButton, { opacity }]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const TabBarIcon = ({ icon, isFocused }) => (
  <Icon
    name={icon}
    size={23}
    color={isFocused ? '#026367' : 'gray'} // Replaced Colors.primary.brand with hex
    style={[styles.icon, isFocused ? styles.iconActive : null]}
  />
);

export default function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarButton: ({ onPress, onLongPress, children, style }) => (
          <CustomTabBarButton onPress={onPress} onLongPress={onLongPress}>
            <View style={[style]}>{children}</View>
          </CustomTabBarButton>
        ),
        animation: 'fade',
        tabBarActiveTintColor: '#026367',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.title,
            tabBarLabel: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon icon={tab.icon} isFocused={focused} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  icon: {
    marginBottom: -3,
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
});
