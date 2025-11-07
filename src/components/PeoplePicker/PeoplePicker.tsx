import React, { useState, useCallback, useMemo, useRef } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { MultiSelect } from 'react-native-element-dropdown';
import PeoplePickerOption from './PeoplePickerOption';
import { RenderSelectedItem } from '../RenderSelectedItem';
import { searchGraphUsersData } from '../../backend/RequestAPI';
import { View, Modal, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Popup } from '@sekizlipenguen/react-native-popup-confirm-toast';
import { setNonM365UsersData } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';

export default function PeoplePicker({ fieldName, values, setFieldValue, styles }) {
  const [searchText, setSearchText] = useState('');
  const [UsersOptions, setUsersOption] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [nonM365UList, setNonM365UList] = useState([]);
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const multiRef = useRef(null);
  const selectedValues = values?.[fieldName] || [];
  const selectedItems = useMemo(() =>
    selectedValues
      .map(val => UsersOptions.find(opt => opt.value === val))
      .filter(Boolean)
  , [selectedValues, UsersOptions]);
  const showPlus = useMemo(() => {
    if (searchText.length < 3) return false;
    const lowerText = searchText.toLowerCase();
    return !UsersOptions.some(opt => 
      opt.label.toLowerCase().includes(lowerText) || 
      (opt.Users?.EMail?.toLowerCase().includes(lowerText))
    );
  }, [searchText, UsersOptions]);
  const unSelectItem = useCallback((itemToRemove) => {
    const newSelected = selectedValues.filter(s => s !== itemToRemove.value);
    setFieldValue(fieldName, newSelected);
  }, [selectedValues, fieldName, setFieldValue]);
  const openModal = useCallback(() => {
    const isEmail = searchText.includes('@');
    setTempName(tempName ? tempName : '');
    setTempEmail(tempEmail ? tempEmail : '');
    setError('');
    setShowModal(true);
  }, [searchText]);
  const handleSubmit = useCallback(() => {
    if (!tempName.trim() || !tempEmail.trim()) {
      setError('Please fill all required fields!');
      setTimeout(() => setError(''), 2000);
      return;
    }
    setError('');
    const newUser = {
      label: tempName.trim(),
      value: tempEmail.trim(),
      Users: {
        Title: tempName.trim(),
        EMail: tempEmail.trim(),
      },
      externalUser: 'Yes',
    };
    setUsersOption(prev => {
      if (prev.some(u => u.value === newUser.value || u.label === newUser.label)) {
        Popup.show({
          type: 'danger',
          title: 'Error!',
          textBody: 'User already exists.',
          buttonEnabled: false,
          timing: 2500,
          callback: () => Popup.hide(),
          containerStyle: { zIndex: 9999999999 }
        });
        return prev;
      }
      const updated = [...prev, newUser];
      const newSelected = [...selectedValues, newUser.value];
      setNonM365UList([...nonM365UList, newUser])
      dispatch(setNonM365UsersData(nonM365UList));
      // setFieldValue(fieldName, newSelected);
      setSearchText('');
      setShowModal(false);
      setTempName('');
      setTempEmail('');
      Popup.show({
        type: 'success',
        title: 'Success!',
        textBody: 'User added successfully!',
        buttonEnabled: false,
        timing: 2500,
        callback: () => Popup.hide(),
        containerStyle: { zIndex: 9999999999 }
      });
      return updated;
    });
  }, [tempName, tempEmail, selectedValues, fieldName, setFieldValue]);
  const handleCancel = useCallback(() => {
    setShowModal(false);
    setTempName('');
    setTempEmail('');
    setError('');
  }, []);
  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length >= 3) {
      try {
        const searchedUser = await searchGraphUsersData(text);
        const updatedUser = searchedUser?.map((i: any) => ({
          label: i.displayName || i.userPrincipalName,
          value: i.userPrincipalName,
          Users: {
            Title: i.displayName || i.userPrincipalName,
            EMail: i.userPrincipalName,
          },
          ...i,
        }));
        setUsersOption(prev => {
          const all = [...prev, ...updatedUser];
          const unique = all.filter(
            (v, i, a) => a.findIndex(t => t.value === v.value) === i
          );
          return unique;
        });
      } catch (error) {
        console.error('Error fetching Graph data:', error);
      }
    }
  };

  const handleChange = (selectedValues) => {
    setFieldValue(fieldName, selectedValues);
    setSearchText('');
    if (multiRef.current) {
      multiRef.current.close();
    }
  };

  return (
    <>
      {
        selectedItems?.length > 0 ?
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
            {selectedItems?.map((item) => (
              <RenderSelectedItem
                key={item.value}
                item={item}
                unSelect={unSelectItem}
                styles={styles}
              />
            ))}
          </View> : ''
      }
     
      <MultiSelect
        ref={multiRef}
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        data={UsersOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Options"
        value={selectedValues}
        onChange={handleChange}
        renderRightIcon={() =>
          showPlus ? (
            <TouchableOpacity
              onPress={() => {
                if (multiRef.current) multiRef.current.close();
                openModal();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="add" size={18} color="#333" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="chevron-down" size={18} color="#333" />
          )
        }
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.dropdownItem}
        search
        searchPlaceholder="Search..."
        onChangeText={handleSearch}
        visibleSelectedItem={false}
        renderItem={option => {
          const name = option?.Users?.Title;
          const mail = option?.Users?.EMail;
          if (!name || !mail) return null;
          return <PeoplePickerOption name={name} mail={mail} />;
        }}
      />
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancel}
      >
        <View style={modalStyles.modalOverlay}>
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
        </View>
      </Modal>
    </>
  );
}

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
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