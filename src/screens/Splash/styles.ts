import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  bottomView: {
    position: 'absolute',
    bottom: 60,
  },
  activityIndicator: {
    marginTop: 10,
  },
});
