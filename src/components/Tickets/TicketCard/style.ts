import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginVertical: 4,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // elevation: 2,
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowItem: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  ticketNumber: {
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: '#333',
  },
  department: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#026367',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  statusText: {
    color: '#000',
    // fontWeight: 'bold',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  date: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginVertical: 8,
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    flexShrink: 1,
    overflow: 'hidden',
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
