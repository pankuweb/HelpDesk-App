import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { Dropdown } from "react-native-element-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDepartments, useFetchSettings, useServices } from '../../../hooks/useRequests';
import { useUnassignedTickets } from '../../../hooks/useTickets';
import { useNavigation } from '@react-navigation/native';
import { useNotification } from '../../Alerts/NotificationProvider';
import { RootState } from '../../../redux/rootReducer';
import axios from 'axios';

const SplitTicket = ({ ticketData, handleSaveSplitTicket, handleCancelSplitTicket, CommentsForReply, userDetails, preAssignName, ReqEmail, SLAResponseDone, SLAResponseInfoData, SLABreachData }) => {
    const [selectedTeam, setSelectedTeam] = useState('');
    const [ticketAlphabets, setTicketAlphabets] = useState('');
    const [ticketProperties, setTicketProperties] = useState(JSON.parse(ticketData?.TicketProperties) || []);
    const { data: settings } = useFetchSettings();

    const { show } = useNotification();

    const navigation = useNavigation();
    const currUser: any = useSelector((state) => state?.login?.user);
    const baseURL = useSelector((state: RootState) => state?.login?.tanent);
    const token: any = useSelector((state: RootState) => state?.login?.token);
    
    const SubticketPropties = JSON.parse(ticketData?.TicketProperties)[0]?.LastSubTicketCharacter;
    const departmentsListData = useSelector((state: RootState) => state?.requests?.departments);
    const serviceListData = useSelector((state: RootState) => state.requests.services); // Assuming services are fetched from Redux state.requests.services
    const departmentsOptions = departmentsListData?.map((i) => ({ label: i.Title, value: i.Title }));
    
    const { isLoading: isServicesLoading, refetch: refetchServices } = useServices();
    const { isLoading: isDepartmentsLoading, refetch: refetchDepartments } = useDepartments();
    const { isLoading, refetch: refetchUnassignedTickets } = useUnassignedTickets();
    
    const departmentCode = departmentsListData?.filter(i=> i.Title === selectedTeam)
    
    const validationSchema = Yup.object({
        title: Yup.string().required('Sub Ticket Title is required'),
        teams: Yup.string().required('Team selection is required'),
        service: Yup.string().required('Service selection is required'),
        comments: Yup.string().optional(),
    });

    const formik = useFormik({
        initialValues: {
            title: '',
            teams: '',
            service: '',
            comments: '',
        },
        validationSchema,
        onSubmit: (values) => {
            handleSaveTicket(values);
        },
    });

    useEffect(() => {
        if (formik.submitCount > 0 && !formik.isValid) {
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
        }
    }, [formik.submitCount, formik.isValid]);

    const filteredServices = formik.values.teams ? serviceListData?.filter(i => i.DepartName === formik.values.teams) : [];
    const serviceOptions = filteredServices?.map((i) => ({ label: i.SubCategory, value: i.SubCategory }));
    console.log(departmentCode?.[0]?.Onqueue,'departmentCode');
    
    const handleCancel = () => {
        formik.resetForm();
        handleCancelSplitTicket();
    };

    const generateGUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
        }).toUpperCase();
    }

    const saveTicketId = async (
        TicketData: any,
        TeamTicketSuffix: "",
        rowId: any,
    ) => {
        try {
        const teamName = departmentCode?.[0]?.Onqueue;

        const PrefixandID = parseInt(settings?.TicketPrefix?.trim()) + rowId;
        const finalticketID = `Ticket#${rowId}`;
        const ticktsequencewithoutSuffix = `${settings?.SequenceTitle}#${PrefixandID}`;

        const ticketSequence =
            TeamTicketSuffix === "On"
            ? `${settings?.SequenceTitle}#${PrefixandID}-${teamName}`
            : `${settings?.SequenceTitle}#${PrefixandID}`;

        const generateRandomString = (length = 10) =>
            Math.random().toString(20).substr(2, length);

        const ticketId = rowId.toString();
        const ylength = 12 - (4 + ticketId?.length);
        const x = generateRandomString(4);
        const y = generateRandomString(parseInt(ylength.toString()));
        const generatedIssueID = x.toUpperCase() + ticketId + y.toUpperCase();

        if (!finalticketID) return;

        const _AutoAssignTicket =
            settings?.AutoAssign === "On" ? "Open" : "Unassigned";

        const finalTemplate = {
            TicketID: finalticketID,
            TicketseqWOsuffix: ticktsequencewithoutSuffix,
            TicketSeqnumber: ticketSequence,
            Status: _AutoAssignTicket,
            IssueId: generatedIssueID,
        };

        const updateUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items(${rowId})`;

        const res = await axios.post(updateUrl, finalTemplate, {
            headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            Authorization: `Bearer ${token}`,
            },
        });

        if (res.status === 204 || res.status === 200) {
            console.log("Ticket updated successfully:", finalticketID);
        }
        } catch (error) {
        console.error("Error updating ticket:", error?.response?.data || error?.message);
        }
    };

    const handleSaveTicket = async (values) => {
        const commentNo = (CommentsForReply?.length + 1).toString();
        let CommentsTo = '';
        let CommentsToEmail = '';
        let ticketAction = [];
        let SLAResponse: '';
        
        if (ReqEmail?.toLowerCase() == userDetails?.Email?.toLowerCase()) {
            CommentsTo = preAssignName == null || preAssignName == undefined || preAssignName == "" ? "this ticket" : preAssignName;
            CommentsToEmail = preAssignName == null || preAssignName == undefined || preAssignName == "" ? "this ticket" : preAssignName;
        } else {
            CommentsTo = ticketData?.RequesterName;
            CommentsToEmail = ReqEmail;
        };
    
        const departmentCodeForUpdate = departmentsListData?.filter(i => i.Title === values.teams);
    
            const updated = [...ticketProperties];
            updated[0] = {                                
                ...updated[0],
                DepartmentCode: departmentCode?.[0]?.Onqueue,
            };

            const newComment = {
                CommentNo: commentNo,
                CommentedBy: userDetails?.FullName,
                CommentedById: userDetails?.Email,
                CommentedDate: new Date().toISOString(),
                CommentType: "Reply",
                CommentBody: encodeURIComponent(values?.comments).replace(/"/g, '|$|'),
                CommentsTo: CommentsToEmail,
                CommentsToName: CommentsTo,
                NoofAttachments: "",
                TimeSpend: '',
                MarkAsAnswer: "No",
                Guid: generateGUID(),
            };

        const updatedComments = CommentsForReply?.length > 0
            ? [...CommentsForReply, newComment]
            : [newComment];

        ticketAction.push({
            action: "Split",
            oldvalue: '',
            newvalue: values?.comments?.replace('<p>', '')?.replace('</p>', '')?.replace(/<[^>]*>/g, ''),
            modifiedby: userDetails?.FullName,
            date: new Date(),
        });
        ticketAction.push({
            action: "Ticket Created",
            oldvalue: '',
            newvalue: 'Ticket Created',
            modifiedby: userDetails?.FullName,
            date: new Date(),
        });

        
        const finalTemplate = {
            Title: values?.title,
            DepartmentName: values?.teams,
            Services: values?.service,
            Comments: JSON.stringify([newComment]),
            Priority: ticketData?.Priority,
            RequestType: ticketData?.RequestType,
            RequesterId: currUser?.UsersId,
            TicketDescription: `<div>${values?.comments}<div/>`,
            Status: "Unassigned",
            RequesterName: currUser?.FullName,
            RequesterEmail: currUser?.Email,
            TicketCreatedDate: new Date().toISOString(),
            TicketProperties: JSON.stringify(updated),
            ActionOnTicket: JSON.stringify(ticketAction),
            MappedAssetDetail: "",
            SLAResponseInfo: JSON.stringify([{
                SLAResponseBreach: "No",
                SLAResponseBreachOn: "",
                SLAResponseReplyTime: "",
                SLAResponseReplyDate: "",
                SLAResponseReplyDay: "",
                SLAResponseEscalateTime: "",
                SLAResponseAlertTime: "",
                SLAResponseNotifyType: "",
                SLAResponseAlertTo: "",
                SLAResponseMailSub: "",
                SLAResponseMailBody: "",
            }]),
            SLAResolveInfo: JSON.stringify([{
                SLAResolveBreach: "No",
                SLAResolveBreachOn: "",
                SLAResolveReplyTime: "",
                SLAResolveReplyDate: "",
                SLAResolveReplyDay: "",
                SLAResolveEscalateTime: "",
                SLAResolveAlertTime: "",
                SLAResolveNotifyType: "",
                SLAResolveAlertTo: "",
                SLAResolveMailSub: "",
                SLAResolveMailBody: "",
            }])
        };

        // console.log(finalTemplate, 'test===');
        

        // return false;

        try {
            const url = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items`;

            const res = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json;odata=nometadata',
                'Content-Type': 'application/json;odata=nometadata',
                'odata-version': '',
                Authorization: `Bearer ${token}`,
                'IF-MATCH': '*',
                'X-HTTP-Method': 'POST',
            },
            body: JSON.stringify(finalTemplate),
            });

            if (res.ok) {
            const responseData = await res.json();
            await saveTicketId(responseData, "", responseData?.ID)
            show({
                type: 'success',
                title: 'Success!',
                message: 'Ticket created successfully!',
                duration: 3000,
                buttonEnabled: false,
                callback: () => {
                    console.log('Notification dismissed');
                },
            });
            setTimeout(() => {
                refetchUnassignedTickets();
                handleSaveSplitTicket();
                navigation.navigate('Tab', { screen: 'UnassignedTickets' });
            }, 3000);
            } else {
            const errorText = await res.text();
            show({
                type: 'error',
                title: 'Error!',
                message: 'Something went wrong..!',
                duration: 3000,
                buttonEnabled: false,
                callback: () => {
                    console.log('Notification dismissed');
                },
            });
            console.error('SharePoint call failed:', errorText);
            }
        } catch (error) {
            show({
                type: 'error',
                title: 'Error!',
                message: 'Something went wrong..!',
                duration: 3000,
                buttonEnabled: false,
                callback: () => {
                    console.log('Notification dismissed');
                },
            });
            console.error('Error while creating ticket:', error);
        }
        console.log(finalTemplate, 'asdf');
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>New Ticket Title <Text style={styles.requredStar}>*</Text></Text>
            <TextInput
                style={[styles.input]}
                value={formik.values.title}
                onChangeText={formik.handleChange('title')}
                onBlur={formik.handleBlur('title')}
                placeholder="Enter Title"
                placeholderTextColor="#333333"
            />
            
            <Text style={styles.label}>Teams <Text style={styles.requredStar}>*</Text></Text>
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                data={departmentsOptions}
                labelField="label"
                valueField="value"
                placeholder="Select Team"
                searchPlaceholder="Search..."
                value={formik.values.teams}
                onChange={(item) => {
                    setSelectedTeam(item.value);
                    formik.setFieldValue("teams", item.value);
                }}
                onBlur={() => formik.setFieldTouched('teams', true)}
                renderRightIcon={() => (
                    <Ionicons name="chevron-down" size={18} color="#333" />
                )}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItem}
            />
            
            <Text style={styles.label}>Services <Text style={styles.requredStar}>*</Text></Text>
            <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholder}
                selectedTextStyle={styles.selectedText}
                data={serviceOptions}
                labelField="label"
                valueField="value"
                placeholder="Select an option"
                searchPlaceholder="Search..."
                value={formik.values.service}
                onChange={(item) => {
                    formik.setFieldValue("service", item.value);
                }}
                onBlur={() => formik.setFieldTouched('service', true)}
                renderRightIcon={() => (
                    <Ionicons name="chevron-down" size={18} color="#333" />
                )}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItem}
            />
            
            <Text style={styles.label}>Comments</Text>
            <TextInput
                style={[styles.input, styles.textarea]}
                value={formik.values.comments}
                onChangeText={formik.handleChange('comments')}
                onBlur={formik.handleBlur('comments')}
                placeholder="Enter Comments"
                placeholderTextColor="#333333"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
            />
            
            <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={formik.submitForm}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SplitTicket;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        width: '100%',
    },
    errorBanner: {
        backgroundColor: '#fee',
        borderWidth: 1,
        borderColor: '#fcc',
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
        width: '100%',
    },
    errorText: {
        color: '#a4262c',
        fontSize: 16,
        fontFamily: 'Roboto-Medium',
        textAlign: 'center',
    },
    text: {
        fontSize: 18,
        color: '#026367',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
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
        width: '100%',
        borderRadius: 4,
        textAlign: 'left',
    },
    textarea: {
        height: 80,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: '#a4262c',
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
    dropdown: {
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        height: 44,
        backgroundColor: "#fff",
        marginBottom: 6,
        width: '100%',
        borderRadius: 4,
    },
    dropdownError: {
        borderColor: '#a4262c',
    },
    placeholder: {
        color: "#333333",
        fontSize: 16,
        fontFamily: "Roboto",
        textAlign: 'left',
    },
    selectedText: {
        fontSize: 16,
        color: "#333333",
        fontFamily: "Roboto",
        textAlign: 'left',
    },
    dropdownContainer: {
        backgroundColor: "#fff",
        padding: 0,
        alignSelf: 'stretch',
    },
    dropdownItem: {
        color: "#333333",
        fontFamily: "Roboto",
        fontSize: 16,
        textAlign: 'left',
    },
    label: {
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: 17,
        marginTop: 1,
        marginBottom: 5,
        color: "#333333",
        width: '100%',
        textAlign: 'left',
    },
    requredStar: {
        color: "#a4262c",
    },
});