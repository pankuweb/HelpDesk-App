import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import BackIcon from 'react-native-vector-icons/Ionicons';
import { ImageSource } from '../constants/image-source';
import { ParamListBase } from '@react-navigation/native';
import { drawerItems } from '../constants';
import styles from './styles';

const Drawer = createDrawerNavigator();

type DrawerContentComponentProps = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
};

const CustomDrawerContent = (props: any) => (
  <DrawerContentScrollView {...props}>
    <View style={styles.drawerHeader}>
      <Image
        source={ImageSource.logo as ImageSourcePropType}
        style={styles.logo}
      />
    </View>
    <View style={styles.separator} />
    {drawerItems
      .filter(item => !item.hideFromDrawer)
      .map(item => (
        <TouchableOpacity
          key={item.name}
          style={styles.customDrawerItem}
          onPress={() => props.navigation.navigate(item.name)}
        >
          <View style={styles.drawerLabelContainer}>
            <Icon name={item.icon} size={23} color={'#026367'} />
            <View style={styles.iconSpacing} />
            <Text style={styles.drawerLabelText}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}
  </DrawerContentScrollView>
);

const DrawerNavigation = () => (
  <Drawer.Navigator
    drawerContent={(props: DrawerContentComponentProps) => (
      <CustomDrawerContent {...props} />
    )}
    screenOptions={{
      headerStyle: styles.header,
      headerTintColor: '#fff',
      headerTitleStyle: styles.headerTitle,
      drawerStyle: styles.drawer,
      drawerActiveTintColor: '#026367',
      drawerInactiveTintColor: '#026367',
      drawerLabelStyle: styles.drawerLabel,
      drawerItemStyle: styles.drawerItem,
      headerTitleAlign: 'center',
    }}
  >
    {drawerItems.map(item => (
      <Drawer.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={({ navigation }: { navigation: DrawerNavigationProp<ParamListBase> }) => ({
          drawerItemStyle: item.hideFromDrawer ? { display: 'none' } : undefined,
          headerTitle: item.title,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                item.name === 'Tab' || item.name === 'MyTickets'
                  ? navigation.openDrawer()
                  : navigation.goBack()
              }
              style={styles.headerLeft}
            >
              {item.name === 'Tab' || item.name === 'MyTickets' ? (
                <Icon name="menu" size={25} color="#fff" />
              ) : (
                <BackIcon name="arrow-back" size={25} color="#fff" />
              )}
            </TouchableOpacity>
          ),
          drawerLabel: item.hideFromDrawer
            ? undefined
            : ({ color }: { color: string }) => (
                <View style={styles.drawerLabelContainer}>
                  <Icon name={item.icon} size={23} color={color} />
                  <View style={styles.iconSpacing} />
                  <Text style={[styles.drawerLabelText, { color }]}>
                    {item.title}
                  </Text>
                </View>
              ),
        })}
      />
    ))}
  </Drawer.Navigator>
);

export default DrawerNavigation;
