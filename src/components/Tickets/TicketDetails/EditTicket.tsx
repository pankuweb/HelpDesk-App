import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EditTicket = ({ ticketData, handleSaveEdit, handleCancelEdit }) => {
  const handleUpdate = () => {
    handleSaveEdit();
  }
  const handleCancel = () => {
    handleCancelEdit();
  }

  console.log(ticketData, "ticket data comming here.....");
  

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit Ticket Screen</Text>
      <View style={styles.modalButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditTicket;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    color: '#026367',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginRight: 10,
    marginLeft: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#026367',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
  },
});