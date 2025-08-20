import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#026367',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    height: 52,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 19,
  },
  drawer: {
    backgroundColor: '#fff',
    width: 250,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  drawerHeader: {
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#026367',
  },
  drawerLabel: {
    marginLeft: -20,
    fontSize: 15,
  },
  drawerItem: {
    height: 30,
    minHeight: 30,
    paddingVertical: 0,
  },
  drawerLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  iconSpacing: {
    width: 8,
  },
  drawerLabelText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#026367'
  },
  headerLeft: {
    marginLeft: 15,
  },
  customDrawerItem: {
    height: 44,
    justifyContent: 'center',
    // paddingHorizontal: 20,
  },
}); 