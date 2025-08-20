import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UnassignedTicketsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>asdf Screen</Text>
    </View>
  );
};


export default UnassignedTicketsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 25, fontWeight: 'bold' },
});
