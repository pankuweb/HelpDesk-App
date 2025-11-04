import { StyleSheet, Platform } from 'react-native';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerIconButton: {
    paddingHorizontal: 8,
  },
  tabBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 56,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  moretabItem: {
    width: 60,
    paddingHorizontal: 5,
  },
  tabLabel: {
    fontSize: 16,
    textTransform: 'none',
    fontFamily: 'Roboto-Regular',
  },
  activeTabLabel: {
    color: '#000',
    fontFamily: 'Roboto-Bold',
  },
  inactiveTabLabel: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    backgroundColor: '#026367',
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchOverlay: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    backgroundColor: '#f1f1f1ff',
    zIndex: 1000,
  },
  searchBar: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 0,
    elevation: 2,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    height: 46,
  },
  searchInput: {
    fontSize: 16,
    marginBottom:100,
    position: 'relative',
    top: -6,
    marginBottom: Platform.OS === 'ios' ? 2 : 0,
  },
  closeIcon: {
    marginLeft: 8,
    padding: 6,
  },
  tabContentContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tabContent: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginTop: 90,
    marginLeft: 170,
    borderRadius: 8,
    paddingVertical: 8,
    width: 130,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  modalItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  modalItemText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
});

export default styles;