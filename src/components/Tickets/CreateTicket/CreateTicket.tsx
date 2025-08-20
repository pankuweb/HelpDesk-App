import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CreateTicket = () => (
  <View style={styles.container}>
      <Text>Create Ticket</Text>
  </View>
);

export default CreateTicket;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
