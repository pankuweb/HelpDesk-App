import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoDataAvailable = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No data Available</Text>
  </View>
);

export default NoDataAvailable;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontFamily: "Roboto-Regular" },
});
