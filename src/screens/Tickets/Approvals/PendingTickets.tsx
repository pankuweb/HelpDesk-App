import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NoDataAvailable from '../../../components/NoDataAvailable';

const PendingTickets = () => (
  <View style={styles.container}>
    <NoDataAvailable />
  </View>
);

export default PendingTickets;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 25, fontWeight: 'bold', fontFamily: "Roboto-Regular" },
});
