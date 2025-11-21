import React, { useState, useCallback, useMemo, useRef } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { MultiSelect } from 'react-native-element-dropdown';
import PeoplePickerOption from './PeoplePickerOption';
import { RenderSelectedItem } from '../RenderSelectedItem';
import { searchGraphUsersData } from '../../backend/RequestAPI';
import { View, Modal, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Popup } from '@sekizlipenguen/react-native-popup-confirm-toast';
import { setNonM365UsersData } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import AddNonM365UserModal, { modalStyles } from './AddNonM365UserModal';
import { NotificationProvider, useNotification } from '../Alerts/NotificationProvider';

export default function PeoplePickerMain({ fieldName, values, setFieldValue }) {
  const [searchText, setSearchText] = useState('');
  const [UsersOptions, setUsersOption] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nonM365UList, setNonM365UList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { show } = useNotification();
  
  const dispatch = useDispatch();
  const multiRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const selectedValues = values?.[fieldName] || [];
  const selectedItems = useMemo(() =>
    selectedValues
      .map(val => UsersOptions.find(opt => opt.value === val))
      .filter(Boolean)
  , [selectedValues, UsersOptions]);
  
  const filteredOptions = useMemo(() => {
    if (searchText.length < 3) return [];
    const lowerText = searchText.toLowerCase();
    return UsersOptions.filter(opt => {
      const isMatch = opt?.label?.toLowerCase()?.includes(lowerText) || 
                      opt?.Users?.EMail?.toLowerCase()?.includes(lowerText);
      const isNotSelected = !selectedValues.includes(opt.value);
      return isMatch && isNotSelected;
    });
  }, [searchText, UsersOptions, selectedValues]);
  
  const showPlus = useMemo(() => {
    if (searchText.length < 3) return false;
    const lowerText = searchText.toLowerCase();
    return !UsersOptions.some(opt => 
      opt?.label?.toLowerCase()?.includes(lowerText) || 
      opt?.Users?.EMail?.toLowerCase()?.includes(lowerText)
    );
  }, [searchText, UsersOptions]);
  
  const unSelectItem = useCallback((itemToRemove) => {
    const newSelected = selectedValues.filter(s => s !== itemToRemove.value);
    setFieldValue(fieldName, newSelected);
  }, [selectedValues, fieldName, setFieldValue]);

  const openModal = useCallback(() => {
    setShowModal(true);
    setShowDropdown(false);
  }, []);

  const handleModalSubmit = useCallback((name: string, email: string) => {
    if (!name || !email) {
      show({
          type: 'error',
          title: 'Error!',
          message: 'Name and email are required.',
          duration: 3000,
          buttonEnabled: false,
          callback: () => {
              console.log('Notification dismissed');
          },
        });
      return;
    }
    const newUser = {
      label: name,
      value: email,
      Users: {
        Title: name,
        EMail: email,
      },
      externalUser: 'Yes',
    };
    setUsersOption(prev => {
      if (prev.some(u => u.value === newUser.value || u.label === newUser.label)) {
        show({
          type: 'error',
          title: 'Error!',
          message: 'User already exists.',
          duration: 3000,
          buttonEnabled: false,
          callback: () => {
              console.log('Notification dismissed');
          },
        });
        return prev;
      }
      const updated = [...prev, newUser];
      const newSelected = [...selectedValues, newUser.value];
      setFieldValue(fieldName, newSelected);
      const updatedNonM365List = [...nonM365UList, newUser];
      setNonM365UList(updatedNonM365List);
      dispatch(setNonM365UsersData(updatedNonM365List));
      setSearchText('');
      setShowModal(false);
      show({
          type: 'success',
          title: 'Success!',
          message: 'User added successfully!',
          duration: 3000,
          buttonEnabled: false,
          callback: () => {
              console.log('Notification dismissed');
          },
        });
      return updated;
    });
  }, [selectedValues, fieldName, setFieldValue, nonM365UList, dispatch]);

  const handleModalCancel = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length >= 3) {
      setShowDropdown(true);
      try {
        const searchedUser = await searchGraphUsersData(text);
        const updatedUser = searchedUser
          ?.filter((i: any) => i && (i.displayName || i.userPrincipalName))
          .map((i: any) => ({
            label: i.displayName || i.userPrincipalName,
            value: i.userPrincipalName,
            Users: {
              Title: i.displayName || i.userPrincipalName,
              EMail: i.userPrincipalName,
            },
            ...i,
          })) || [];
        setUsersOption(prev => {
          const all = [...prev, ...updatedUser];
          const unique = all.filter(
            (v, i, a) => v && v.value && a.findIndex(t => t.value === v.value) === i
          );
          return unique.filter(opt => opt && opt.label && typeof opt.label === 'string');
        });
      } catch (error) {
        console.error('Error fetching Graph data:', error);
      }
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelectOption = (option) => {
    if (selectedValues.includes(option.value)) {
      return;
    }
    const newSelected = [...selectedValues, option.value];
    setFieldValue(fieldName, newSelected);
    setSearchText('');
    setShowDropdown(false);
  };

  const isEmail = searchText.includes('@');
  const initialName = isEmail ? '' : searchText;
  const initialEmail = isEmail ? searchText : '';

  return (
    <>
      {selectedItems?.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
          {selectedItems?.map((item) => {
            const displayText = item?.label || item?.value || '';
            const truncatedText = displayText.length > 17 
              ? displayText.substring(0, 17) + '...' 
              : displayText;
            
            return (
              <RenderSelectedItem
                key={item.value}
                item={{ ...item, label: truncatedText }}
                unSelect={unSelectItem}
                styles={styles}
              />
            );
          })}
        </View>
      )}
     
      <View style={styles.customSearchContainer}>
        <TextInput
          ref={searchInputRef}
          style={styles.customSearchInput}
          placeholder="Enter Name"
          placeholderTextColor="#000"
          value={searchText}
          onChangeText={handleSearch}
          onFocus={() => {
            if (searchText.length >= 3) {
              setShowDropdown(true);
            }
          }}
        />
        <View style={styles.searchIconContainer}>
          {showPlus ? (
            <TouchableOpacity
              onPress={openModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="add-circle" size={22} color="#026367" />
            </TouchableOpacity>
          ) : (
            <Ionicons name="chevron-down" size={20} color="#000" />
          )}
        </View>
      </View>

      {showDropdown && filteredOptions.length > 0 && (
        <View style={styles.customDropdown}>
          {filteredOptions.map((option, index) => {
            const name = option?.Users?.Title;
            const mail = option?.Users?.EMail;
            if (!name || !mail) return null;
            
            return (
              <TouchableOpacity
                key={option.value || index}
                style={styles.dropdownOptionItem}
                onPress={() => handleSelectOption(option)}
              >
                <PeoplePickerOption name={name} mail={mail} />
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {showDropdown && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        />
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleModalCancel}
      >
        <NotificationProvider>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
            <AddNonM365UserModal
              initialName={initialName}
              initialEmail={initialEmail}
              onSubmit={handleModalSubmit}
              onClose={handleModalCancel}
              styles={styles}
            />
          </View>
        </NotificationProvider>
      </Modal>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flexGrow: 1,
    paddingBottom: 100,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#026367',
    fontWeight: '500',
  },
  text: {
    fontFamily: "Roboto",
    fontSize: 14,
    color: "#333333",
  },
  label: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 1,
    marginBottom: 5,
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    fontFamily: "Roboto",
    color: "#333333",
    marginBottom: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: "#fff",
    marginBottom: 6,
  },
  placeholder: {
    color: "#333333",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  selectedText: {
    fontSize: 16,
    color: "#333333",
    fontFamily: "Roboto",
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 0,
  },
  dropdownItem: {
    color: "#333333",
    fontFamily: "Roboto",
    fontSize: 16,
  },
  dropdownItemContainer: {
    padding: 0,
  },
  richInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    minHeight: 120,
    backgroundColor: "#fff",
    padding: 8,
    fontFamily: "Roboto",
    color: "#333333",
  },
  attachmentText: {
    color: "#fff",
    fontFamily: "Roboto",
    fontSize: 16,
  },
  submissionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  submitBtn: {
    backgroundColor: "#026367",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginRight: 10,
  },
  attachmentBtn: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Roboto",
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  attachmentItem: {
    width: '49%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 6,
  },
  attachmentName: {
    flex: 1,
    marginRight: 8,
    color: '#333',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 16,
    paddingRight: 8,
    paddingLeft: 4,
    paddingVertical: 4,
    marginHorizontal: 2,
    marginVertical: 4,
  },
  selectedTextMulti: {
    marginRight: 4,
    marginLeft: 2,
    color: '#333',
    fontSize: 14,
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  },
  image: {
    marginRight: 6,
    backgroundColor: '#ccc',
  },
  requredStar: {
    color: "#a4262c",
  },
  customSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 6,
    position: 'relative',
    zIndex: 1000,
  },
  customSearchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: '#333',
    paddingVertical: 0,
  },
  searchIconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderTopWidth: 0,
    maxHeight: 250,
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownOptionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'hidden',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
});