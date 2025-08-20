import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import UnassignedTickets from '../Tickets/UnassignedTickets';
import MyTickets from '../Tickets/MyTickets/MyTickets';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator();

const tabs = [
  { name: 'Unassigned', label: 'Unassigned Tickets', icon: 'home-outline', component: UnassignedTickets },
  { name: 'MyTickets', label: 'My Tickets', icon: 'person-outline', component: MyTickets },
  { name: 'UnassignedT', label: 'UnassignedT', icon: 'home-outline', component: UnassignedTickets },
  { name: 'MyTicketsT', label: 'MyTicketsT', icon: 'person-outline', component: MyTickets },
  { name: 'MyTicketsTs', label: 'MyTicketsTs', icon: 'person-outline', component: MyTickets },
];

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
    color={isFocused ? '#9e0fb5' : '#007AFF'} // Replaced Colors.primary.brand with hex
    style={[styles.icon, isFocused ? styles.iconActive : null]}
  />
);

export default function TabScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarButton: ({ onPress, onLongPress, children, style }) => (
          <CustomTabBarButton onPress={onPress} onLongPress={onLongPress}>
            <View style={[style]}>{children}</View>
          </CustomTabBarButton>
        ),
        animation: 'fade',
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            title: tab.label,
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
