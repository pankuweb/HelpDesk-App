import React, { useState, useCallback, useMemo, useRef } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import PeoplePickerOption from './PeoplePickerOption';
import { RenderSelectedItem } from '../RenderSelectedItem';
import { searchGraphUsersData } from '../../backend/RequestAPI';
import { View, Modal, TextInput, TouchableOpacity } from 'react-native';
import { setNonM365UsersData } from '../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import AddNonM365UserModal from './AddNonM365UserModal';
import { NotificationProvider, useNotification } from '../Alerts/NotificationProvider';

export default function PeoplePicker({ fieldName, values, setFieldValue, styles }) {
  const [searchText, setSearchText] = useState('');
  const [UsersOptions, setUsersOption] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nonM365UList, setNonM365UList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { show } = useNotification();
  
  const dispatch = useDispatch();
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
          message: 'User already exists!',
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
          {selectedItems?.map((item) => (
            <RenderSelectedItem
              key={item.value}
              item={item}
              unSelect={unSelectItem}
              styles={styles}
            />
          ))}
        </View>
      )}
     
      {/* Custom Search Box */}
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
            <Ionicons name="chevron-down" size={18} color="#000" />
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