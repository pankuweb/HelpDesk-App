import React, { useState, useCallback, useMemo, useRef } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { MultiSelect } from 'react-native-element-dropdown';
import PeoplePickerOption from './PeoplePickerOption';
import { RenderSelectedItem } from '../RenderSelectedItem';
import { searchGraphUsersData } from '../../backend/RequestAPI';
import { View, Modal, StyleSheet, TouchableOpacity } from 'react-native';
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
  const { show } = useNotification();
  
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
    }
  };

  const handleChange = (selectedValues) => {
    setFieldValue(fieldName, selectedValues);
    setSearchText('');
    if (multiRef.current) {
      multiRef.current.close();
    }
  };

  const isEmail = searchText.includes('@');
  const initialName = isEmail ? '' : searchText;
  const initialEmail = isEmail ? searchText : '';

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
  },
  image: {
    marginRight: 6,
    backgroundColor: '#ccc',
  },
  requredStar: {
    color: "#a4262c",
  },
});