import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNotification } from '../Alerts/NotificationProvider';

interface AddNonM365UserModalProps {
  initialName: string;
  initialEmail: string;
  onSubmit: (name: string, email: string) => void;
  onClose: () => void;
  styles: any;
}

export const modalStyles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Roboto-Bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    fontFamily: 'Roboto-Regular',
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  submitButton: {
    backgroundColor: '#026367',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  cancelButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Roboto",
  },
});

export default function AddNonM365UserModal({ initialName, initialEmail, onSubmit, onClose, styles }: AddNonM365UserModalProps) {
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [error, setError] = useState('');
const { show } = useNotification();
  useEffect(() => {
    if (true) {
      setTempName(initialName);
      setTempEmail(initialEmail);
      setError('');
    }
  }, [initialName, initialEmail]);

  const handleSubmit = () => {
    if (!tempName.trim() || !tempEmail.trim()) {
      show({
            type: 'error',
            title: 'Error!',
            message: 'Please fill all required fields',
            duration: 3000,
            buttonEnabled: false,
            callback: () => {
                console.log('Notification dismissed');
            },
        });
      return;
    }
    setError('');
    onSubmit(tempName.trim(), tempEmail.trim());
  };

  const handleCancel = () => {
    setTempName('');
    setTempEmail('');
    setError('');
    onClose();
  };

  return (
    <View style={modalStyles.modalContent}>
      <Text style={modalStyles.modalTitle}>
        Add Non M365 User
      </Text>
      {error ? (
        <Text style={modalStyles.errorText}>{error}</Text>
      ) : null}
      <Text style={[styles.label, {marginTop: 10,}]}>Name <Text style={{ color: '#a4262c' }}>*</Text></Text>
      <TextInput
        style={modalStyles.input}
        placeholder="Name"
        value={tempName}
        onChangeText={setTempName}
      />
      <Text style={styles.label}>Email <Text style={{ color: '#a4262c' }}>*</Text></Text>
      <TextInput
        style={modalStyles.emailInput}
        placeholder="Email ID"
        value={tempEmail}
        onChangeText={setTempEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={modalStyles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={modalStyles.submitButton}
        >
          <Text style={modalStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancel}
          style={modalStyles.cancelButton}
        >
          <Text style={modalStyles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}