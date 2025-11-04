import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";
import { Formik } from "formik";
import { pick } from "@react-native-documents/picker";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import ImagePicker from "react-native-image-crop-picker";
import Warning from "../../Alerts/Warning";
import Success from "../../Alerts/Success";
import Ionicons from "react-native-vector-icons/Ionicons";
import { fetchHR365HDMCustomColumns, fetchHR365HDMSettings, fetchHR365HDMTicketFieldSettings, fetchImage } from "../../../backend/RequestAPI";
import { useAMXAssets, useDepartments, useFetchGraphUsers, useFetchUsers, usePriority, useRequestTypes, useServices, useSubServices, useSubServicesLevelWise } from "../../../hooks/useRequests";
import { useSelector } from "react-redux";
import DateTimePicker from '@react-native-community/datetimepicker';
import Persona from "../Persona/Persona";
import PeoplePickerOption from "../../PeoplePicker/PeoplePickerOption";
import { ImageSource } from "../../../constants";
import { RenderSelectedItem } from "../../RenderSelectedItem";
import PeoplePicker from "../../PeoplePicker/PeoplePicker";

const CreateTicket = () => {
  const richText = useRef();
  const [showSuccess, setShowSuccess] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [FNames, setFNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedSubService, setSelectedSubService] = useState('');
  const [selectedSubServiceL2, setSelectedSubServiceL2] = useState('');
  const [CustomForms, setCustomForms] = useState([]);
  const [requestFormType, setRequestFormType] = useState({});
  const [showPicker, setShowPicker] = useState(false);
  const [settings, setSettings] = useState({});
  const [CustomColumns, setCustomColumns] = useState([]);

  const usersData = useSelector((state) => state?.users?.users);
  const graphUsersData = useSelector((state) => state?.users?.graphUsers);
  const { isLoading: isFetchUsersLoading, refetch: refetchUsers } = useFetchUsers();
  const { isLoading: isFetchGraphUsersLoading, refetch: refetchFetchGraphUsers } = useFetchGraphUsers();

  const UsersOption = usersData?.map(i => ({ ...i, label: i?.Users?.Title || `Unknown User (${i?.ID})`, value: i?.Users?.Title || `Unknown User (${i?.ID})` }));

  const { isLoading: isServicesLoading, refetch: refetchServices } = useServices();
  const { isLoading: isSubServicesLoading, refetch: refetchSubServices } = useSubServices();
  const { isLoading: isSubServicesLWLoading, refetch: refetchSubServicesLW } = useSubServicesLevelWise();
  const { isLoading: isPriorityLoading, refetch: refetchPriority } = usePriority();
  const { isLoading: isRquestTypesLoading, refetch: refetchRquestTypes } = useRequestTypes();
  const { isLoading: isDepartmentsLoading, refetch: refetchDepartments } = useDepartments();
  const { isLoading: isAssetsLoading, refetch: refetchAssets } = useAMXAssets();

  const serviceListData = useSelector((state: RootState) => state.requests.services);
  const Role = useSelector((state: RootState) => state.login.user)?.Roles;
  const BaseURL = useSelector((state: RootState) => state.login.tanent);
  const filteredServices = selectedTeam ? serviceListData?.filter(i => i.DepartName === selectedTeam) : [];
  const serviceOptions = filteredServices?.map((i)=> ({ label: i.SubCategory, value: i.SubCategory }));

  const subServiceListData = useSelector((state: RootState) => state.requests.subServices);
  const filteredSubServices = selectedService ? subServiceListData?.filter(i => i.MainServices === selectedService) : [];
  const subServiceOptions = filteredSubServices?.map((i)=> ({ label: i.SubServices, value: i.SubServices }))?.filter((item) => item.label && item.value);
  
  const subServiceLW2ListData = useSelector((state: RootState) => state.requests.subServicesLevelWise);
  const filteredSubServicesLW2 = selectedSubService ? subServiceLW2ListData?.filter(i => i.SubServicesL1 === selectedSubService) : [];
  const subServiceLW2Options = filteredSubServicesLW2?.map(i => ({ label: i.SubServicesL2, value: i.SubServicesL2 }))?.filter((item) => item.label && item.value);

  const filteredSubServicesLW3 = selectedSubService ? subServiceLW2ListData?.filter(i => i.SubServicesL2 === selectedSubServiceL2) : [];
  const subServiceLW3Options = filteredSubServicesLW3?.map((i)=> ({ label: i.SubServicesL3, value: i.SubServicesL3 }))?.filter((item) => item.label && item.value);

  const priorityListData = useSelector((state: RootState) => state.requests.priority);
  const priorityOptions = priorityListData?.map((i)=> ({ label: i.Title, value: i.Title }));

  const requestTypesListData = useSelector((state: RootState) => state.requests.requestTypes);
  const requestTypesOptions = requestTypesListData?.map((i)=> ({ label: i.Title, value: i.Title }));

  const departmentsListData = useSelector((state: RootState) => state.requests.departments);
  const departmentsOptions = departmentsListData?.map((i)=> ({ label: i.Title, value: i.Title }));
  const assetsListData = useSelector((state: RootState) => state.requests.assets);
  const assetsOptions = assetsListData?.map((i)=> ({ label: i.Title, value: i.Title }));
  const fetchTicketFields = async () => {
    const fetchedTicketFieldsSetting = await fetchHR365HDMTicketFieldSettings();
    const fetchedCustomColumn = await fetchHR365HDMCustomColumns();
    const customColumnFields = fetchedCustomColumn?.map((i)=>{
        return {
            DisplayName: i.ColumnName,
            InternalName: i.Title,
            Type: i?.Type1,
            values: i.ColumnName,
            DefultValue: i.ColumnName,
            ListName: i.ColumnName,
            SelectedColumnName: i.ColumnName,
            ChoiceType: i.ChoiceType,
            ShowType: "",
            ColumnValues: 
            i?.ColumnValues?.split(",")?.map(item => {
                            const trimmed = item?.trim();

                            return { 
                              label: trimmed, 
                              value: trimmed, 
                              selected: trimmed == i.DefultValue?.trim()
                            };
                          }),
            DefultValue: i.DefultValue,
          };
      });
    setCustomColumns(customColumnFields);

    const settingsData = await fetchHR365HDMSettings();
    setSettings(settingsData)
    const fetchCustomFormSetting = JSON.parse(settingsData?.CustomFormSettings)?.map((i) => ({
      label: i.FormName,
      value: i.FormName,
      selected: i.DefaultForm,
      ...i,
    }));

    const isDefaultForm = fetchCustomFormSetting?.filter(i=> i.DefaultForm === 'Yes');

    setCustomForms(fetchCustomFormSetting);
    setRequestFormType(fetchCustomFormSetting?.filter(i=> i.selected === 'Yes')?.[0]);

    const extractedFields = ['Admin', 'Agent', 'Supervisor']?.includes(Role) ? fetchedTicketFieldsSetting?.TicketFieldsForMember?.split(',') : fetchedTicketFieldsSetting?.TicketFieldsForUser?.split(',');
    const extractedFieldsOfDrag = fetchedTicketFieldsSetting?.TicketsFieldsDrag?.split(',');
    const filteredFieldsBasedOnUser = extractedFieldsOfDrag?.filter(item => extractedFields?.includes(item));
  
    if(fetchCustomFormSetting?.length > 0 && isDefaultForm?.length > 0){
      const selectedFormsFields = JSON.parse(fetchCustomFormSetting?.filter(i=> i.selected === 'Yes')?.[0]?.TicketField)?.map((i)=>{
        return {
            DisplayName: i.text,
            InternalName: i.IntName,
            Type: i?.Type,
            values: i.text,
            DefultValue: i.text,
            ListName: i.text,
            SelectedColumnName: i.text,
            ChoiceType: i.text,
            ShowType: i.ShowType || "",
          };
      });
      const filteredCustomColumn = customColumnFields?.filter(c => selectedFormsFields?.some(s => s.DisplayName === c.DisplayName));

      setFNames([...new Map([...selectedFormsFields, ...filteredCustomColumn]?.map(f => [f?.DisplayName, f]))?.values()]);
    } else {
      const transformedFieldsOfDrag = filteredFieldsBasedOnUser?.map((i)=>{
        return {
            DisplayName: i,
            InternalName: i,
            Type: i,
            values: i,
            DefultValue: i,
            ListName: i,
            SelectedColumnName: i,
            ChoiceType: i,
            ShowType: i || "",
          };
      });
      const filteredCustomColumn = customColumnFields?.filter(c => transformedFieldsOfDrag?.some(s => s.DisplayName === c.DisplayName));

      setFNames([...new Map([...transformedFieldsOfDrag, ...filteredCustomColumn]?.map(f => [f?.DisplayName, f]))?.values()]);
    }
    setLoading(false);
  }

  const onChangeCustomForm = (item) => {
    setLoading(true);
    const selectedData = CustomForms?.find((i) => i.label === item.value);
    const mergedData = JSON.parse(selectedData?.TicketField)?.map(item => {
      const matchedColumn = CustomColumns?.find(col => col.DisplayName === item.text);

      if (matchedColumn) {
        return {
          ...item,
          ColumnValues: matchedColumn?.ColumnValues || null,
          DefultValue: matchedColumn?.DefultValue || null,
        };
      }

      return item;
    });
    const selectedFormsFields = mergedData?.map((i)=>{
      return {
          DisplayName: i.text,
          InternalName: i.IntName,
          Type: i?.Type,
          values: i.text,
          DefultValue: i?.DefultValue || i.text,
          ListName: i.text,
          SelectedColumnName: i.text,
          ChoiceType: i?.ChoiceType || i.text,
          ShowType: i.ShowType || "",
          ColumnValues: i?.ColumnValues ? i.ColumnValues : [],
        };
    });
    setFNames(selectedFormsFields);
    setRequestFormType(selectedData);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }
  useEffect(() => {
    fetchTicketFields();
  }, []);

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      });
      const b64 = `data:${image?.mime};base64,${image?.data}`;
      richText?.current?.insertImage(b64);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.log('Gallery Error: ', error);
      }
    }
  };

  const openCamera = async () => {
    try {
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
        includeBase64: true,
      });
      const b64 = `data:${image.mime};base64,${image.data}`;
      richText.current?.insertImage(b64);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.log('Camera Error: ', error);
      }
    }
  };

  const insertImage = () => {
    Alert.alert(
      'Insert Image',
      'Choose source',
      [
        {
          text: 'Camera',
          onPress: openCamera,
        },
        {
          text: 'Gallery',
          onPress: openGallery,
        },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const handleSubmitForm = async (values, { resetForm }) => {
    // if (
    //   !values.title ||
    //   !values.service ||
    //   !values.requestType ||
    //   !values.priority ||
    //   !values.subService ||
    //   !values.description
    // ) {
    //   setWarningMessage("Please fill all required fields");
    //   return;
    // }

    console.log(values, 'test===>>>>>')
    setShowSuccess(true);
    resetForm();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#026367" />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          initialValues={{
            title: "",
            service: "",
            requestType: "",
            priority: "",
            subServicel1: "",
            subServicel2: "",
            subServicel3: "",
            assetDetails: "",
            description: "",
            teams: "",
            Cc: "",
            attachments: [],
            customColData: {},
          }}
          onSubmit={handleSubmitForm}
        >
          {({ handleChange, handleBlur, handleSubmit, setFieldValue, values }) => (
            <>
              {
                CustomForms?.length > 1 ? 
                  <>
                    <Text style={[styles.label, {textAlign: 'center'}]}>Select Ticket Request Form</Text>
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholder}
                      selectedTextStyle={styles.selectedText}
                      data={CustomForms}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Ticket Request Form"
                      value={requestFormType}
                      itemContainerStyle={styles.dropdownItemContainer} 
                      onChange={onChangeCustomForm}
                      renderRightIcon={() => (
                        <Ionicons name="chevron-down" size={18} color="#333" />
                      )}
                      containerStyle={styles.dropdownContainer}
                      itemTextStyle={styles.dropdownItem}
                    />
                  </> : ''
              }
              {
                FNames?.map((item, index) => {
                  return item.InternalName == "Title" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Title</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={handleChange("title")}
                        onBlur={handleBlur("title")}
                        value={values.title}
                        placeholder="Enter Title"
                        placeholderTextColor="#333333"
                      />
                    </React.Fragment>
                  : item.InternalName == "Priority" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Priority Type</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={priorityOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Priority Type"
                        search={Array.isArray(priorityOptions) && priorityOptions?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.priority}
                        onChange={(item) => setFieldValue("priority", item.value)}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "Request Type" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Request Type</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={requestTypesOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Request Type"
                        search={Array.isArray(requestTypesOptions) && requestTypesOptions?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.requestType}
                        onChange={(item) => setFieldValue("requestType", item.value)}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "Services" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Service</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={serviceOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select an option"
                        search={Array.isArray(serviceOptions) && serviceOptions?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.service}
                        onChange={(item) => {
                          setSelectedService(item.value)
                          setFieldValue("service", item.value)
                        }}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "SubServices" ||
                    item.InternalName == "Sub Services" ||
                    item.InternalName == "Sub Services L1" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Sub Service L1</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={subServiceOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select an option"
                        search={Array.isArray(subServiceOptions) && subServiceOptions?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.subServicel1}
                        onChange={(item) => {
                          setSelectedSubService(item.value);
                          setFieldValue("subServicel1", item.value);
                        }}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "SubServiceL2" ||
                  item.InternalName == "Sub Services L2" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Sub Service L2</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={subServiceLW2Options}
                        labelField="label"
                        valueField="value"
                        placeholder="Select an option"
                        search={Array.isArray(subServiceLW2Options) && subServiceLW2Options?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.subServicel2}
                        onChange={(item) => {
                          setFieldValue("subServicel2", item.value);
                          setSelectedSubServiceL2(item.value);
                        }}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "SubServiceL3" ||
                  item.InternalName == "Sub Services L3" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Sub Service L3</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={subServiceLW3Options}
                        labelField="label"
                        valueField="value"
                        placeholder="Select an option"
                        search={Array.isArray(subServiceLW3Options) && subServiceLW3Options?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.subServicel3}
                        onChange={(item) => setFieldValue("subServicel3", item.value)}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "Asset detail" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Asset Detail</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={assetsOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Asset"
                        search={Array.isArray(assetsOptions) && assetsOptions?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.assetDetails}
                        onChange={(item) => setFieldValue("assetDetails", item.value)}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "Requester" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Requester</Text>
                      <PeoplePicker
                        fieldName="Requester"
                        values={values}
                        setFieldValue={setFieldValue}
                        styles={styles}
                      />
                    </React.Fragment>
                  : item.InternalName == "Teams" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Teams</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={departmentsOptions}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Team"
                        search={Array.isArray(departmentsOptions) && departmentsOptions?.length > 0}
                        searchPlaceholder="Search..."
                        value={values.teams}
                        onChange={(item) => {
                          setSelectedTeam(item.value)
                          setFieldValue("teams", item.value)
                        }}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.InternalName == "Cc" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Cc</Text>
                      <PeoplePicker
                        fieldName="Cc"
                        values={values}
                        setFieldValue={setFieldValue}
                        styles={styles}
                      />
                    </React.Fragment>
                  : item.InternalName == "Ticket Description" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>Description</Text>
                      <RichEditor
                        ref={richText}
                        style={styles.richInput}
                        placeholder="Enter ticket description..."
                        placeholderTextColor="#333333"
                        initialContentHTML={values.description}
                        onChange={(text) => setFieldValue("description", text)}
                        editorStyle={{
                          backgroundColor: "#fff",
                          color: "#333333",
                          placeholderColor: "#333333",
                          cssText: "body {font-family: Roboto; font-size: 16px;}",
                        }}
                      />
                      <View style={{ marginBottom: 6 }}>
                        <RichToolbar
                          editor={richText}
                          actions={[
                            actions.setBold,
                            actions.setItalic,
                            actions.setUnderline,
                            actions.insertOrderedList,
                            actions.insertBulletsList,
                            actions.heading1,
                            actions.heading2,
                            actions.heading3,
                            actions.setParagraph,
                            actions.insertLink,
                            actions.insertImage,
                            actions.undo,
                            actions.redo,
                          ]}
                          onPressAddImage={insertImage}
                          iconMap={{
                            [actions.heading1]: ({ tintColor }) => (
                              <Text style={{ color: "#333333", fontWeight: "600", fontSize: 18 }}>H1</Text>
                            ),
                            [actions.heading2]: ({ tintColor }) => (
                              <Text style={{ color: "#333333", fontWeight: "600", fontSize: 18 }}>H2</Text>
                            ),
                            [actions.heading3]: ({ tintColor }) => (
                              <Text style={{ color: "#333333", fontWeight: "600", fontSize: 18 }}>H3</Text>
                            ),
                            [actions.setParagraph]: ({ tintColor }) => (
                              <Text style={{ color: "#333333", fontWeight: "600", fontSize: 18 }}>P</Text>
                            ),
                            [actions.insertCode]: ({ tintColor }) => (
                              <Text style={{ color: "#333333", fontWeight: "600", fontSize: 18 }}>{`</>`}</Text>
                            ),
                          }}
                          iconTint="#000"
                        />
                      </View>
                    </React.Fragment> 
                  : item.Type == "Text" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>{item?.DisplayName}</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) =>
                          setFieldValue(`customColData.${item?.InternalName}`, text)
                        }
                        onBlur={() =>
                          handleBlur(`customColData.${item?.InternalName}`)
                        }
                        value={values?.customColData?.[item?.InternalName] || ""}
                        placeholder=""
                        placeholderTextColor="#333333"
                      />
                    </React.Fragment>
                  : item.Type == "Note" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>{item?.DisplayName}</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) =>
                          setFieldValue(`customColData.${item?.InternalName}`, text)
                        }
                        onBlur={() =>
                          handleBlur(`customColData.${item?.InternalName}`)
                        }
                        value={values?.customColData?.[item?.InternalName] || ""}
                        placeholder="Enter Title"
                        placeholderTextColor="#333333"
                      />
                    </React.Fragment>
                  : item.Type == "Number" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>{item?.DisplayName}</Text>
                      <TextInput
                        style={styles.input}
                        onChangeText={(text) =>
                          setFieldValue(`customColData.${item?.InternalName}`, text)
                        }
                        keyboardType="numeric"
                        onBlur={() =>
                          handleBlur(`customColData.${item?.InternalName}`)
                        }
                        value={values?.customColData?.[item?.InternalName] || ""}
                        placeholder="Enter Title"
                        placeholderTextColor="#333333"
                      />
                    </React.Fragment>
                  : item.Type == "DateTime" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>{item?.DisplayName}</Text>

                      <TouchableOpacity
                        style={styles.input}
                        onPress={() => setShowPicker(true)}
                      >
                        <Text
                          style={{
                            color: values?.customColData?.[item?.InternalName] ? '#000' : '#999',
                          }}
                        >
                          {values?.customColData?.[item?.InternalName]
                            ? new Date(values.customColData[item.InternalName]).toDateString()
                            : ""}
                        </Text>
                      </TouchableOpacity>

                      {showPicker && (
                        <DateTimePicker
                          value={
                            values?.customColData?.[item?.InternalName]
                              ? new Date(values.customColData[item.InternalName])
                              : new Date()
                          }
                          mode="date"
                          display="default"
                          onChange={(event, selectedDate) => {
                            setShowPicker(false);
                            if (selectedDate) {
                              setFieldValue(
                                `customColData.${item?.InternalName}`,
                                selectedDate.toISOString()
                              );
                            }
                          }}
                        />
                      )}
                    </React.Fragment>
                  : item.Type == "Choice" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>{item?.DisplayName}</Text>
                      <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={item?.ColumnValues}
                        labelField="label"
                        valueField="value"
                        search={Array.isArray(item?.ColumnValues) && item?.ColumnValues?.length > 0}
                        searchPlaceholder="Search..."
                        placeholder="Select Option"
                        value={values?.customColData?.[item?.InternalName] || item?.ColumnValues?.filter(i=> i.selected === true)?.[0]}
                        onChange={(selected) => {
                          setFieldValue(`customColData.${item?.InternalName}`, selected.value);
                        }}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                      />
                    </React.Fragment>
                  : item.Type == "MultipleChoice" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>{item?.DisplayName}</Text>
                      <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={item.ColumnValues}
                        confirmSelectItem
                        labelField="label"
                        valueField="value"
                        placeholder="Select Options"
                        search={Array.isArray(item?.ColumnValues) && item?.ColumnValues?.length > 0}
                        searchPlaceholder="Search..."
                        value={
                          values?.customColData?.[item?.InternalName] ||
                          item?.ColumnValues?.filter(i => i.selected)?.map(i => i.value)
                        }
                        onChange={selectedValues => {
                          setFieldValue(`customColData.${item?.InternalName}`, selectedValues);
                        }}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                        renderSelectedItem={(item, unSelect) => (
                          <View style={styles.selectedItem}>
                            <Text style={styles.selectedTextMulti}>{item.label}</Text>
                            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                              <Ionicons name="close-circle" size={18} color="#555" />
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    </React.Fragment>
                  : item.Type == "User" ? 
                    <React.Fragment key={index}>
                      <Text style={styles.label}>{item?.DisplayName}</Text>
                      <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholder}
                        selectedTextStyle={styles.selectedText}
                        data={UsersOption}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Options"
                        value={
                          values?.customColData?.[item?.InternalName] || []
                        }
                        onChange={selectedValues => {
                          setFieldValue(`customColData.${item?.InternalName}`, selectedValues);
                        }}
                        renderRightIcon={() => (
                          <Ionicons name="chevron-down" size={18} color="#333" />
                        )}
                        containerStyle={styles.dropdownContainer}
                        itemTextStyle={styles.dropdownItem}
                        search={Array.isArray(UsersOption) && UsersOption?.length > 0}
                        searchPlaceholder="Search..."
                        renderSelectedItem={(item, unSelect) => (
                          <View style={styles.selectedItem}>
                            <Text style={styles.selectedTextMulti}>{item.label}</Text>
                            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                              <Ionicons name="close-circle" size={18} color="#555" />
                            </TouchableOpacity>
                          </View>
                        )}
                        renderItem={option => {
                          const name = option?.Users?.Title;
                          const mail = option?.Users?.EMail;

                          if (!name || !mail) return null;

                          return (
                            <PeoplePickerOption
                                name={name}
                                mail={mail}
                              />
                          );
                        }}
                      />
                    </React.Fragment>
                  : ""
                })
              }
              <View style={styles.submissionWrapper}>
                <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                  <Text style={styles.submitBtnText}>Create Ticket</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.attachmentBtn}
                  onPress={async () => {
                    try {
                      const result = await pick({
                        allowMultiSelection: true,
                        type: ["image/*"],
                      });
                      if (result && result.length > 0) {
                        setFieldValue("attachments", [...values.attachments, ...result]);
                      }
                    } catch (err) {
                      Alert.alert("File Error", err.message);
                    }
                  }}
                >
                  <Ionicons name="attach" size={26} color="#026367" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>

              {values.attachments.length > 0 && (
                <View style={[styles.attachmentsContainer, { marginBottom: 50 }]}>
                  {values.attachments.map((item, index) => (
                    <View key={index} style={styles.attachmentItem}>
                      <Text style={styles.attachmentName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          const updated = values?.attachments?.filter((_, i) => i !== index);
                          setFieldValue("attachments", updated);
                        }}
                      >
                        <Ionicons name="close" size={21} color="#026367" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </Formik>
      </ScrollView>
      <Warning
        message={warningMessage}
        visible={!!warningMessage}
        onHide={() => setWarningMessage("")}
      />
      <Success
        message="Ticket created successfully!"
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
      />
    </View>
  );
};

export default CreateTicket;

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
});