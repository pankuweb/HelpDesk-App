import React, { useState, useCallback, useMemo } from 'react';
import Ionicons from "react-native-vector-icons/Ionicons";
import { MultiSelect } from 'react-native-element-dropdown';
import PeoplePickerOption from './PeoplePickerOption';
import { RenderSelectedItem } from '../RenderSelectedItem';
import { searchGraphUsersData } from '../../backend/RequestAPI';
import { View } from 'react-native';

export default function PeoplePicker({ fieldName, values, setFieldValue, styles }) {
  const [searchText, setSearchText] = useState('');
  const [UsersOptions, setUsersOption] = useState([]);

  const selectedValues = values?.[fieldName] || [];

  const selectedItems = useMemo(() => 
    selectedValues
      .map(val => UsersOptions.find(opt => opt.value === val))
      .filter(Boolean)
  , [selectedValues, UsersOptions]);

  const unSelectItem = useCallback((itemToRemove) => {
    const newSelected = selectedValues.filter(s => s !== itemToRemove.value);
    setFieldValue(fieldName, newSelected);
  }, [selectedValues, fieldName, setFieldValue]);

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text.length >= 3) {
      try {
        const searchedUser = await searchGraphUsersData(text);

        const updatedUser = searchedUser?.map((i: any) => ({
          label: i.displayName || i.userPrincipalName,
          value: i.displayName || i.userPrincipalName,
          Users: {
            Title: i.displayName,
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
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        data={UsersOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Options"
        value={selectedValues}
        onChange={selectedValues => {
          setFieldValue(fieldName, selectedValues);
        }}
        renderRightIcon={() => <Ionicons name="chevron-down" size={18} color="#333" />}
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
    </>
  );
}