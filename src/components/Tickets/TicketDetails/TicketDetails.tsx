import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  Alert,
  PermissionsAndroid,
  Modal,
  TextInput,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { pick, isCancel } from "@react-native-documents/picker";
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import ImagePicker from "react-native-image-crop-picker";
import moment from 'moment';
import Persona from '../Persona/Persona';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import EditTicket from './EditTicket';
import CreateTicket from './CreateSubTicket';
import {Root as PopupRootProviderssss} from '@sekizlipenguen/react-native-popup-confirm-toast';
import { NotificationProvider, useNotification } from '../../Alerts/NotificationProvider';
import PeoplePicker from '../../PeoplePicker/PeoplePicker';
import PeoplePickerMain from '../../PeoplePicker/PeoplePickerMain';
import { useDepartments, useFetchEmailTemplates, useFetchSettings, useFetchUsers } from '../../../hooks/useRequests';
import { RootState } from '../../../redux/store';
import axios from 'axios';
import { fetchAttachments, getSiteUsers, PostHR365HDMExternalEmailData, postMailTrackerData, searchGraphUsersData, sendGraphMail, uploadAttachments } from '../../../backend/RequestAPI';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';
import { TemplateReplacerForCusrtomColumns, encodeEmailData, replaceAnchorTags } from '../../../hooks/customHooks';
import { Dropdown } from 'react-native-element-dropdown';

const isStringValidated = (value) => {
  if (value == null || value == undefined || value == "") {
    return false;
  } else {
    return true;
  }
}
const isArrayValidated = (value) => {
  if (value == null || value == undefined || value.length === 0) {
    return false;
  } else {
    return true;
  }
}
const TicketDetails = ({ route }) => {
  const { ticketData } = route.params;
  const { data: settings } = useFetchSettings();
  const { show } = useNotification();

  const TRACKING_API_URL = "https://mt.msapps365.com";

  let AllLinks = [];
  let FormattedDataForLink = [];
  const ticketProp = ticketData?.TicketProperties;
  const DeptCode = JSON.parse(ticketProp)?.[0]?.DepartmentCode;
  const ticketID = ticketData?.ID;
  const ticketSQNo = ticketData?.TicketSeqnumber;
  const ReqEmail = ticketData?.RequesterEmail;
  const ticketAssignedToMail = ticketData?.AssignedTomail;
  const ticketAction = ticketData?.ActionOnTicket;
  const ticketTitle = ticketData?.Title;

  const baseURL = useSelector((state: RootState) => state?.login?.tanent);
  const token: any = useSelector((state: RootState) => state?.login?.token);

  
  const url = new URL(baseURL);
  const tenantName = url.hostname;
  const siteName = url.pathname.split("/")[2];
  
  const navigation = useNavigation();
  const userDetails = useSelector((state) => state?.login?.user);
   const departmentsListData = useSelector((state: RootState) => state.requests.departments);
   const departmentsOptions = departmentsListData?.map((i)=> ({ label: i.Title, value: i.Title }));
 
  const [menuVisible, setMenuVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [replyOptionsVisible, setReplyOptionsVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [isOpenReply, setIsOpenReply] = useState(false);
  const [replyType, setReplyType] = useState('');
  const [showCCModal, setShowCCModal] = useState(false);
  const [showReplyCCModal, setShowReplyCCModal] = useState(false);
  const [ccInput, setCcInput] = useState([]);
  const [replyCcInput, setReplyCcInput] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubTicketModal, setShowSubTicketModal] = useState(false);
  const [consultant, setConsultant] = useState([]);
  const [isConsult, setISConsultant] = useState(false);
  const [isTransfer, setISTransfer] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState('');
  const [preAssignName, setPreAssignName] = useState("");
  const [TimeSpendValue, setTimeSpendValue] = useState();
  const [MarkAsAnswer, setMarkAsAnswer] = useState("No");
  const [CommentsForReply, setCommentsForReply] = useState(JSON.parse(ticketData?.Comments || "[]"))
  const [CommentsAttachments, setCommentsAttachments] = useState([]);
  const [globalMessage, setGlobalMessage] = useState("<p id='Comments10p1144'><br></p>");
  const [SLABreachData, setSLABreachData] = useState(isStringValidated(ticketData?.SLABreachData) ? JSON.parse(ticketData?.SLABreachData) : [{
    SLAStatus: '',
    TimeBreached: '',
    BreachReason: '',
    FirstResponseTime: '',
  }]);
  const [SLAResponseInfoData, setSLAResponseInfoData] = useState(isStringValidated(ticketData?.SLAResponseInfo) ? JSON.parse(ticketData?.SLAResponseInfo) : []);
  const [SLAResponseDone, setSLAResponseDone] = useState(isStringValidated(ticketData?.SLAResponseDone) ? ticketData?.SLAResponseDone : '',);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
 
  const richTextRef = useRef(null);
  const descriptionRef = useRef(null);

  const { data: RequesterEmailTemp, isLoading: isEmailTemplatesLoading, refetch: refetchEmailTemplates } = useFetchEmailTemplates("Requester - Public Comment Created");
  const { data: TeamsData, isLoading: isDepartmentsLoading, refetch: refetchDepartments } = useDepartments();
  const { data: ListUsers, isLoading: isFetchUsersLoading, refetch: refetchUsers } = useFetchUsers();
  
  const getDisplayName = (fileName: string) => {
    const parts = fileName.split('___');
    return parts.length > 1 ? parts[1] : fileName;
  };

  const downloadFileSilently = useCallback(async (fileName: string): Promise<void> => {
    try {
      const url = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items(${ticketID})/AttachmentFiles('${fileName}')/$value`;

      const response = await axios({
        method: 'GET',
        url,
        headers: {
          Accept: 'application/json;odata=nometadata',
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer',
      });

      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      const cleanName = fileName.split('___')[1] || fileName;

      const destPath = Platform.OS === 'android'
        ? `${RNFS.DownloadDirectoryPath}/${cleanName}`
        : `${RNFS.DocumentDirectoryPath}/${cleanName}`;

      await RNFS.writeFile(destPath, base64, 'base64');

      if (Platform.OS === 'android') {
        await RNFS.scanFile(destPath);
      }
    } catch (err: any) {
      console.error('Download failed:', err.response?.status, err.message);
      throw err;
    }
  }, [baseURL, ticketID, token]);

  const downloadSingle = useCallback(async (fileName: string) => {
    try {
      await downloadFileSilently(fileName);

      show({
        type: 'success',
        title: 'Success!',
        message: 'File downloaded successfully!',
        duration: 3000,
        buttonEnabled: false,
      });
    } catch (err) {
      show({
        type: 'error',
        title: 'Error!',
        message: 'Could not download file!',
        duration: 3000,
        buttonEnabled: false,
      });
    }
  }, [downloadFileSilently]);

  const downloadAll = useCallback(async (attachments: any[]) => {
    if (attachments.length === 0) return;

    try {
      for (const att of attachments) {
        await downloadFileSilently(att.fileName);
      }

      show({
        type: 'success',
        title: 'Success!',
        message: 'Files downloaded successfully!',
        duration: 3000,
        buttonEnabled: false,
      });
    } catch (err) {
      show({
        type: 'error',
        title: 'Error!',
        message: 'Could not download one or more files!',
        duration: 3000,
        buttonEnabled: false,
      });
    }
  }, [downloadFileSilently]);
 
  const handleSetCcValue = useCallback((fieldName, newValue) => {
    if (fieldName === 'Cc') {
      setCcInput(newValue);
    }
  }, []);

  const handleSetReplyCcValue = useCallback((fieldName, newValue) => {
    if (fieldName === 'Cc') {
      setReplyCcInput(newValue);
    }
  }, []);

  const handleConsultant = useCallback((fieldName, newValue) => {
    if (fieldName === 'Consultant') {
      setConsultant(newValue);
    }
  }, []);

  useEffect(() => {
    const loadAttachments = async () => {
      const data = await fetchAttachments(
        "HR365HDMTickets",
        ticketID
      );
      setCommentsAttachments(data);
      console.log("Attachments:", CommentsForReply);
    };
    loadAttachments();
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardVisible(true);
      });
  
      const hideSub = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardVisible(false);
      });
  
      return () => {
        showSub.remove();
        hideSub.remove();
      };
  }, []);
  
  useEffect(() => {
    if (descriptionRef.current && ticketData?.TicketDescription) {
      const content = `<p>${ticketData.TicketDescription}</p>`;
      descriptionRef.current.setContentHTML(content);
    }
  }, [ticketData?.TicketDescription]);

  useEffect(() => {
    setCommentsForReply(JSON.parse(ticketData?.Comments || "[]"));
  }, [ticketData]);

  useEffect(() => {
    if (isOpenReply && replyType === 'reply' && (!comment || comment.trim() === '')) {
      const defaultContent = `
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>Regards</p>
        <p style="margin-bottom: 4px;">${userDetails?.FullName || ``}</p>
        <p style="margin-bottom: 4px;">${userDetails?.Department || ``}</p>
        <p style="margin-bottom: 0;">${userDetails?.Mobile || ``}</p>
      `;
      setComment(defaultContent);
      if (richTextRef.current) {
        richTextRef.current.setContentHTML(defaultContent);
      }
    } else if (isOpenReply && replyType === 'private note') {
      setComment('');
      if (richTextRef.current) {
        richTextRef.current.setContentHTML('');
      }
    } else if (isOpenReply && isConsult) {
      const defaultContent = `
        <p>Please take a look at this ticket</p>
        <p>${ticketSQNo || ``}</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>Regards</p>
        <p style="margin-bottom: 4px;">${userDetails?.FullName || ``}</p>
        <p style="margin-bottom: 4px;">${userDetails?.Department || ``}</p>
        <p style="margin-bottom: 0;">${userDetails?.Mobile || ``}</p>
      `;
      setComment(defaultContent);
      if (richTextRef.current) {
        richTextRef.current.setContentHTML(defaultContent);
      }
    } else if (isOpenReply && isTransfer) {
      const defaultContent = `
        <p>Please take a look at this ticket</p>
        <p>${ticketSQNo || ``}</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>Regards</p>
        <p style="margin-bottom: 4px;">${userDetails?.FullName || ``}</p>
        <p style="margin-bottom: 4px;">${userDetails?.Department || ``}</p>
        <p style="margin-bottom: 0;">${userDetails?.Mobile || ``}</p>
      `;
      setComment(defaultContent);
      if (richTextRef.current) {
        richTextRef.current.setContentHTML(defaultContent);
      }
    } else {
      if (richTextRef.current) {
        richTextRef.current.setContentHTML('');
      }
      setComment('');
    }
  }, [isOpenReply, replyType, userDetails]); 

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const toggleReplyOptions = (e) => {
    e.stopPropagation();
    setReplyOptionsVisible(!replyOptionsVisible);
  };

  const closeReplyReplyOptions = () => {
    setReplyOptionsVisible(false);
  };

  const closeAllDropdowns = () => {
    closeMenu();
    closeReplyReplyOptions();
  };

  const pickAttachment = async () => {
    try {
      const results = await pick({
        allowMultiSelection: true,
        type: ["image/*"],
      });
      if (results && results?.length > 0) {
        setAttachments(prev => [...prev, ...results]);
      }
    } catch (err) {
      if (!isCancel(err)) {
        console.log('Attachment Error: ', err);
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveCC = () => {
    if (ccInput.trim()) {
      console.log('Saving CC:', ccInput);
      setCcInput('');
    }
    setShowCCModal(false);
  };

  const handleCancelCC = () => {
    setCcInput('');
    setShowCCModal(false);
  };

  const handleSaveReplyCC = () => {
      setReplyCcInput(replyCcInput);
    setShowReplyCCModal(false);
  };

  const handleReplyCancelCC = () => {
    setReplyCcInput('');
    setShowReplyCCModal(false);
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleSaveSubTicket = () => {
    setShowSubTicketModal(false);
  };

  const handleCancelSubTicket = () => {
    setShowSubTicketModal(false);
  };

  const generateGUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
  }

  const generateRandomString = (length = 10) =>
    Math.random().toString(20).substr(2, length);

  const ticketId = ticketID?.toString();
  const ylength = 12 - (4 + ticketId?.length);
  const x = generateRandomString(4);
  const y = generateRandomString(parseInt(ylength.toString()));
  const generatedIssueID = x.toUpperCase() + ticketId + y.toUpperCase();

  const sendEmailReply = async (subject, body, toOwner, from, CC) => {
    const filteredCC = CC?.filter((email) => email !== "" && email?.length > 0)
    body = body.replaceAll('</p>', '<br>').replaceAll('<p>', '')

    try {
      const requestData = {
        emailUniqueId: generateGUID(),
        email: userDetails?.Email,
        userId: toOwner?.join(","),
        senderId: userDetails?.Email,
        tenantName: tenantName,
        siteName: siteName,
        mtrk: "Yes",
        conversationId: "",
        TeamCode: DeptCode,
      };

      let FinalData = encodeEmailData(requestData)
      
      const content = `
        <span id='Comments10span817' style="display:none;">
          <img id='Comments10img1091' src="https://mt.msapps365.com/api/v1/read?emailUniqueId=${FinalData?.['emailUniqueId']}&userId=${FinalData?.['userId']}&senderId=${FinalData?.['senderId']}&email=${FinalData?.['email']}&mtrk=${FinalData?.['mtrk']}&tenantName=${FinalData?.['tenantName']}&siteName=${FinalData?.['siteName']}&conversationId=${FinalData?.['conversationId']}" style="display:none;">
        </span>
      `;

      if(settings?.IsMailTracker){
        body += content; 
        replaceAnchorTags(
          body,
          TRACKING_API_URL,
          requestData?.emailUniqueId,
          requestData?.senderId,
          requestData
        );
      }

    if(settings?.IsMailTracker){
      await postMailTrackerData(FinalData, requestData,subject,body,CC,DeptCode, ticketSQNo, AllLinks,FormattedDataForLink);
    }

     try {
       const emailMessage = {
          message: {
              subject: subject,
              body: {
                  contentType: 'HTML',
                  content: body,
              },
              toRecipients: toOwner?.map((email) => ({ emailAddress: { address: email } })),
              ccRecipients: !settings?.IsCCDisabled == 'On' ? filteredCC?.map((email) => ({ emailAddress: { address: email } })) : [],
              from: {
                emailAddress: {
                  address: '',
                },
              },
          },
      };

      await sendGraphMail(emailMessage);
     } catch (error) {
      console.error(error);
     }

  } catch (error) {
      console.error('Error sending email via Graph API:', error);
  }
}
  
  const postExternal = async (from, to, body, sub, CCMailsForSpUILITY,ticketid = null,AttachmentNames = null) => {
    try {
      if (isStringValidated(JSON.parse(ticketProp)?.[0]?.MailBox)) {
        from = JSON.parse(ticketProp)?.[0]?.MailBox
      }

      const requestData = {
        emailUniqueId: generateGUID(),
        email: from,
        userId: to?.join(","),
        senderId: userDetails?.Email,
        tenantName: tenantName,
        siteName: siteName,
        mtrk: "Yes",
        conversationId: "",
        TeamCode: DeptCode,
      };

      let FinalData = encodeEmailData(requestData)
      
      const content = `
        <span id='Comments10span818' style="display:none;">
          <img id='Comments10img1092' src="https://mt.msapps365.com/api/v1/read?emailUniqueId=${FinalData?.['emailUniqueId']}&userId=${FinalData?.['userId']}&senderId=${FinalData?.['senderId']}&email=${FinalData?.['email']}&mtrk=${FinalData?.['mtrk']}&tenantName=${FinalData?.['tenantName']}&siteName=${FinalData?.['siteName']}&conversationId=${FinalData?.['conversationId']}" style="display:none;">
        </span>
      `;  
        
      if(settings?.IsMailTracker){
        await postMailTrackerData(FinalData, requestData,sub,body,CCMailsForSpUILITY,DeptCode, ticketSQNo, AllLinks,FormattedDataForLink);
      }

      CCMailsForSpUILITY = [...new Set(CCMailsForSpUILITY?.flat())]
      let filteredEmails = CCMailsForSpUILITY?.filter((email) => email !== "" && email?.length > 0);
      filteredEmails = filteredEmails?.filter((item, index) => {
        return (
      (    filteredEmails?.findIndex(
            (element) => element === item
          ) === index)
        );
      })?.join(",");

      let emails = filteredEmails?.split(',')?.map(email => email?.toLowerCase());
      let uniqueEmails = [...new Set(emails)];
      let uniqueEmailString = uniqueEmails;
      
      body = body.replaceAll('</p>', '<br>').replaceAll('<p>', '')
      if(settings?.IsMailTracker){
        body += content
        try {
          replaceAnchorTags(
            body,
            TRACKING_API_URL,
            requestData?.emailUniqueId,
            requestData?.senderId,
            requestData
          );
        } catch (error) {
          console.log(error)
        }
      }

      let finalTemplate = {
        cC: settings?.IsCCDisabled == 'On' ? '' : replyType === 'private note' ? CCMailsForSpUILITY?.join() : uniqueEmailString?.join(),
        From: from,
        To: to.join(';'),
        Body: body,
        Subject: sub,
        TickeID:ticketid,
        AttachmentName:AttachmentNames
      };

      if(settings?.IsMailTracker){
        await postMailTrackerData(FinalData, requestData,sub,body,finalTemplate?.cC,DeptCode, ticketSQNo, AllLinks,FormattedDataForLink);
      }
      await PostHR365HDMExternalEmailData(finalTemplate);
   } catch(error){
      if (isStringValidated(JSON.parse(ticketProp)?.[0]?.MailBox)) {
        from = JSON.parse(ticketProp)?.[0]?.MailBox
      }
      body = body.replaceAll('</p>', '<br>').replaceAll('<p>', '')
      let finalTemplate = {
        cC: settings?.IsCCDisabled == 'On' ? '' : replyType === 'private note' ? CCMailsForSpUILITY?.join() : '',
        From: from,
        To: to.join(';'),
        Body: body,
        Subject: sub
      };

      await PostHR365HDMExternalEmailData(finalTemplate);
   }
  }

  const sendMail = async (commentNo) => {
      let starRatinghtml = "";
      let CCMailsForSpUILITY = [];
      let CCMails = [];
      let InternalType = JSON?.parse(ticketProp)?.[0]?.InternalExtrenal;
      let ccemailid = JSON.parse(ticketProp)?.[0]?.CCMail;
    
      let SendComments =  CommentsForReply
        ?.filter(c => c?.CommentType === "Reply")
        ?.sort((a, b) => {
          return new Date(b?.CommentedDate).getTime() - new Date(a?.CommentedDate).getTime();
        });

      const filterDepartments = TeamsData?.filter(item=> item.Title === ticketData?.DepartmentName);

      const siteUsers = await getSiteUsers();
      
      if (filterDepartments?.length > 0) {
        if (RequesterEmailTemp?.EmailSentTo?.includes('Teams Supervisors')) {
          if (filterDepartments?.[0].Supervisor1Id.length) {
            filterDepartments[0].Supervisor1Id?.map((x) => {
              var finalemail = siteUsers?.filter((i) => {
                return i.Id == x
              })
              if (finalemail.length) {

                CCMails?.push(finalemail[0].Email);
              }

            })
          };
        };
      }

    if (RequesterEmailTemp?.EmailSentTo?.includes('Teams Members')) {
      if (filterDepartments?.[0].Teammembers1Id.length) {
        filterDepartments?.[0].Teammembers1Id?.map((x) => {
          var finalemail = siteUsers?.filter((i) => {
            return i.Id == x
          })

          if (finalemail.length) {

            CCMails?.push(finalemail[0].Email);
          }
        })
      };
    };

    if (RequesterEmailTemp?.EmailSentTo?.includes('Assignee')) {
      CCMails?.push(ticketAssignedToMail);
    };

    const updatedAttachments = attachments?.length > 0
      ? attachments?.map(file => {
          const originalName = file.name || "file";

          const cleanName = originalName.replace(
            /[`~!@#$%^&*()|+\=?;:'",<>\\\/{}\[\]]/g,
            "_"
          );
          return {
            ...file,
            name: `${commentNo}___${cleanName}`,
          };
        })
      : attachments;

    const AttachmentURLS = updatedAttachments?.map(file => ({
      Url: `${baseURL}/Lists/HR365HDMTickets/Attachments/${ticketID}/${file.name}`,
      Name: file.name.includes("___")
        ? file.name.split("___")[1]
        : file.name,
    }));

    let TagAnchorAttachment = '';
    AttachmentURLS?.forEach((item) => {
      const Link = `<a target="_blank" href="${item?.Url}">${item?.Name}</a>`;
      TagAnchorAttachment += Link + '<br>';
    })

    let CommentBodyMaile: any

    let fromemail;
    if (
      settings?.DefaultAssignee == null ||
      settings?.DefaultAssignee == undefined ||
      settings?.DefaultAssignee == ""
    ) {
      fromemail = "no-reply@sharepointonline.com";
    } else {
      fromemail = settings?.DefaultAssignee;
    }

    if (((ReqEmail?.split('@')[1] == fromemail.split("@")[1]) && settings?.DefaultAssignee != "no-reply@sharepointonline.com") || (InternalType == "External" && settings?.DefaultAssignee != "no-reply@sharepointonline.com")) {
      if (generatedIssueID != null) {
        var date = new Date().toISOString();
        var dateclosed = moment(date).format('MM/DD/YYYY');
        hrperurl1 = "https://customervoice.m365online.us/zs/AlzB1B?TicketID=" + ticketSQNo?.split('#')[1] + "&?TicketTitle=" + ticketTitle + "&?Question=" + ticketData?.SurveyQuestion + "&?tempid=" + generatedIssueID + "&?SID=" + settings?.DefaultAssignee + "&?Date=" + dateclosed;
      }
      starRatinghtml = '<div >' +
        '<div  style="display:flex;align-items:center;justify-content:center;"><p style="font-size:17px;font-weight:600">How satisfied are you with our customer service?</p></div>' +
        '<div  style="display:flex;flex-wrap:wrap;justify-content:center;">' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #E41508; " > <span ><a style="color: #E41508; text-decoration:none;" href="' + hrperurl1 + '&rating=1">Very Dissatisfied</a></p></p > ' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #C05407;" > <span ><a style="color: #C05407; text-decoration:none;" href="' + hrperurl1 + '&rating=2">Dissatisfied</a></p></p > ' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #9E6900;" > <span ><a style="color: #9E6900; text-decoration:none;" href="' + hrperurl1 + '&rating=3">Fair</a></p></p > ' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color:#5E8000;" > <span ><a style="color: #5E8000; text-decoration:none;" href="' + hrperurl1 + '&rating=4">Satisfied</a></p></p > ' +
        '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #158901 ;" > <span><a style="color: #158901; text-decoration:none;" href="' + hrperurl1 + '&rating=5">Very Satisfied</a></p></p > ' +
        '</div >'
    } else {
      let taskUrl = `${baseURL}#/Ticket/${generatedIssueID}`;
      
      starRatinghtml = '<div >' +
        '<div  style="display:flex;align-items:center;justify-content:center;"><p style="font-size:17px;font-weight:600">How satisfied are you with our customer service?</p></div>' +
        '<div  style="display:flex;flex-wrap:wrap;justify-content:center;">' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #E41508; " > <span ><a style="color: #E41508; text-decoration:none;" href="' + taskUrl + '&rating=1">Very Dissatisfied</a></p></p > ' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #C05407;" > <span ><a style="color: #C05407; text-decoration:none;" href="' + taskUrl + '&rating=2">Dissatisfied</a></p></p > ' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #9E6900;" > <span ><a style="color: #9E6900; text-decoration:none;" href="' + taskUrl + '&rating=3">Fair</a></p></p > ' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color:#5E8000;" > <span><a style="color: #5E8000; text-decoration:none;" href="' + taskUrl + '&rating=4">Satisfied</a></p></p > ' +
        '<p  style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #158901 ;" > <span ><a style="color: #158901; text-decoration:none;" href="' + taskUrl + '&rating=5">Very Satisfied</a></p></p > ' +
        '</div >'
    }
    let latestReplyComments = SendComments;
    if (settings?.TicketThreadToggle === "On") {
      if (settings?.TicketThread < SendComments.length) {
        latestReplyComments = latestReplyComments?.slice(0, settings?.TicketThread);
      }
    }

    if (settings?.TicketThreadToggle === "null") {
      CommentBodyMaile = [];
      for (let i = 0; i < latestReplyComments.length; i++) {
        let MailHTML = `<hr><span id='Comments10span631' style="font-weight: 600;">From: </span> ${latestReplyComments?.[i]?.CommentedBy}&#44 <br><span id='Comments10span632' style="font-weight: 600;">To: </span> ${latestReplyComments[i]?.CommentsTo}&#44
        <br>
        <span id='Comments10span633'>${(CheckUri(latestReplyComments[i]?.CommentBody?.replace(/&nbsp;/g, ' ')))}</span>`;
        CommentBodyMaile?.push(MailHTML);
      };
      CommentBodyMaile = globalMessage?.concat(CommentBodyMaile);
      CommentBodyMaile = CommentBodyMaile

    } else {
      CommentBodyMaile = globalMessage
    }
    

    if (RequesterEmailTemp?.IsActive == "Yes") {
      const CustomFromName = JSON.parse(settings?.CustomFormSettings)?.[0]?.FormName;
      
      let _sub1 = RequesterEmailTemp?.Subject.replaceAll("[ticket.subject]", ticketTitle);
      let _sub2 = _sub1.replaceAll("[ticket.id]", "[" + ticketSQNo + "]")?.replaceAll("[Custom_Form]", CustomFromName);
      _sub2 = _sub2.replaceAll('[ticket.url]', "").replaceAll('[ticket.attachment_url]', TagAnchorAttachment).replaceAll('[ticket.description]', comment).replaceAll('[ticket.latest_comment]', CommentBodyMaile).replaceAll('[ticket.agent.name]', ticketData?.AssignedTo?.Title).replaceAll('[ticket.agent.email]', ticketAssignedToMail).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', ticketData?.Status).replaceAll('[ticket.ticket_type]', ticketData?.RequestType).replaceAll('[ticket.priority]', ticketData?.Priority).replaceAll('[ticket.requester.name]', ticketData?.RequesterName).replaceAll('[ticket.from_email]', ReqEmail);
      _sub2 = _sub2.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[ticket.satisfaction_survey_withStar]', starRatinghtml);

      let _body1 = RequesterEmailTemp?.Body.replaceAll("[ticket.subject]", ticketTitle);
      let _body = _body1.replaceAll("[ticket.agent.name]", ticketData?.AssignedTo?.Title).replaceAll('[ticket.attachment_url]', TagAnchorAttachment);
      let _body2 = _body.replaceAll("[ticket.latest_comment]", CommentBodyMaile);
      let _body3 = _body2.replaceAll("[ticket.requester.name]", ticketData?.RequesterName);
      _body3 = _body3.replaceAll('[ticket.attachment_url]', TagAnchorAttachment).replaceAll("[ticket.id]", ticketSQNo)?.replaceAll("[Custom_Form]", CustomFromName).replaceAll('[ticket.description]', comment).replaceAll('[ticket.agent.email]', ticketAssignedToMail).replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', ticketData?.Status).replaceAll('[ticket.ticket_type]', ticketData?.RequestType).replaceAll('[ticket.priority]', ticketData?.Priority).replaceAll('[ticket.from_email]', ReqEmail);
      _body3 = _body3.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[ticket.satisfaction_survey_withStar]', starRatinghtml);
      let taskUrl = `${baseURL}#/Ticket/${generatedIssueID}`;

      let _body4 = _body3.replaceAll(
        "[ticket.url]",
        `<a href='${(taskUrl.replaceAll('Survey','Ticket'))}'>${ticketSQNo}</a>`
      ).replaceAll('[ticket.satisfaction_survey]',
        `<a href='${(taskUrl.replaceAll('Ticket','Survey'))}'>Survey Link</a>`
      );


      let sendEmailIds = [];
      const siteUsers = await getSiteUsers();
      const searchedUser = siteUsers?.filter(i=> i.Email == ticketAssignedToMail);
      

      var filtered = ListUsers?.filter((item) => {
        return item.UsersId == JSON.parse(searchedUser?.[0]?.Id);
      });

      filtered?.map((i) => {
        sendEmailIds.push(i.Email);
      });

      var filterGC = siteUsers?.filter((item) => {
        return item?.Id == JSON.parse(searchedUser?.[0]?.Id);
      });

      filterGC?.map((i) => {
        if (i.Email != null && i.Email != undefined) {
          sendEmailIds.push(i.Email);
        }
      });
      
      let uniqueEmails = [...new Set(sendEmailIds)];

      let ccEmailids = [];
      if (ccemailid == null || ccemailid == undefined || ccemailid == "") {
      } else {
        let ccEmail = ccemailid.split(",");
        ccEmail?.map((item) => {
          ccEmailids.push(item);
        });
      }

      if (replyCcInput && replyCcInput?.length > 0) {
        CCMailsForSpUILITY?.push(...replyCcInput);
      }

      let uniqueccEmails = [...new Set(ccEmailids)];

      if (uniqueEmails.length > 0) {
        let FinalUniqueEmails = uniqueEmails?.filter(item => item !== "");
        
        let fromemail = "no-reply@sharepointonline.com";

        if (
          ticketAssignedToMail == null ||
          ticketAssignedToMail == undefined ||
          ticketAssignedToMail == ""
        ) {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = ticketAssignedToMail;
        }

        if (
          settings?.AllowedExtrenalDomain ||
          settings?.AllowedExtrenalDomain != undefined ||
          settings?.AllowedExtrenalDomain != ""
        ) {
            _body4 = TemplateReplacerForCusrtomColumns(_body4, ticketData);
            _sub2 = TemplateReplacerForCusrtomColumns(_sub2, ticketData);

          if (fromemail?.includes(settings?.AllowedExtrenalDomain?.trim()) || settings?.EmailsFromMailbox == "On" || InternalType != 'Internal') {
             postExternal(fromemail, FinalUniqueEmails, _body4, _sub2, CCMailsForSpUILITY);
          } else {
            sendEmailReply(
              _sub2,
              _body4,
              FinalUniqueEmails,
              fromemail,
              CCMailsForSpUILITY
            );
          }
          
        }
      }
    }
    
  }
  
  const handleReply = async () => {
    const commentNo = (CommentsForReply?.length + 1).toString();
    let CommentsTo = '';
    let CommentsToEmail = '';
    let ticketAction = [];
    let SLAResponse: '';
   
    if(replyType === 'reply'){
      if (ReqEmail?.toLowerCase() == userDetails?.Email?.toLowerCase()) {
        CommentsTo = preAssignName == null || preAssignName == undefined || preAssignName == "" ? "this ticket" : preAssignName;
        CommentsToEmail = preAssignName == null || preAssignName == undefined || preAssignName == "" ? "this ticket" : preAssignName;
      } else {
        CommentsTo = ticketData?.RequesterName;
        CommentsToEmail = ReqEmail;
      };
      const newComment = {
        CommentNo: commentNo,
        CommentedBy: userDetails?.FullName,
        CommentedById: userDetails?.Email,
        CommentedDate: new Date().toISOString(),
        CommentType: "Reply",
        CommentBody: encodeURIComponent(comment).replace(/"/g, '|$|'),
        CommentsTo: CommentsToEmail,
        CommentsToName: CommentsTo,
        NoofAttachments: "",
        TimeSpend: TimeSpendValue,
        MarkAsAnswer: MarkAsAnswer,
        Guid: generateGUID(),
      };
      const updatedComments = CommentsForReply?.length > 0
        ? [...CommentsForReply, newComment]
        : [newComment];
      setCommentsForReply(updatedComments);
      if (CommentsToEmail == ReqEmail && SLAResponseDone == "No") {
        SLAResponse = "Yes";
        if (isArrayValidated(SLAResponseInfoData)) {
          let result: any;
          let timestamp = new Date().getTime() - new Date(ticketData?.Created)?.getTime();
          const hours = Math.floor(timestamp / (1000 * 60 * 60));
          const minutes = Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          SLABreachData[0]['SLAStatus'] = result?.breached === true ? 'Breached' : 'Met';
          SLABreachData[0]['TimeBreached'] = result?.breached === true ? result?.breachTime : '0';
          SLABreachData[0]['FirstResponseTime'] = timeString;
          SLAResponseInfoData[0]['SLAResponseReplyTime'] = new Date().toISOString();
          SLAResponseInfoData[0]['SLAResponseReplyTime'] = new Date().toISOString();
          SLAResponseInfoData[0]['SLAResponseReplyDate'] = moment(new Date().toISOString()).format('DD/MM/YYYY');
          SLAResponseInfoData[0]['SLAResponseReplyDay'] = moment(new Date().toISOString()).format('dddd');
        }
      } else if (SLAResponseDone == "Yes") {
        SLAResponse = "Yes";
      } else {
        SLAResponse = "No";
      }
      ticketAction?.push({
        action: "Replied",
        oldvalue: '',
        newvalue: comment?.replace('<p', '')?.replace('</p>', '').replace(/<[^>]*>/g, ''),
        modifiedby: userDetails?.FullName,
        date: new Date().toISOString(),
      });
      let finalTemplate = {
        Comments: JSON.stringify(updatedComments),
        SLABreachData: JSON.stringify(SLABreachData),
        TicketDetails: '',
        LastCommentNo: updatedComments.length.toString(),
        SLAResponseDone: SLAResponse,
        AIBaseTicketDraft: "",
        AIBaseTicket: 'Open',
        ActionOnTicket: JSON.stringify(ticketAction),
        SLAResponseInfo: JSON.stringify(SLAResponseInfoData),
      };
      try {
        const updateUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items(${ticketID})`;
       
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
          if (attachments && attachments.length > 0) {
            for (let i = 0; i < attachments.length; i++) {
              const originalName = attachments[i].name || "file";
              const cleanName = originalName.replace(
                /[`~!@#$%^&*()|+\=?;:'",<>\\\/{}\[\]]/g,
                "_"
              );
              attachments[i].name = `${commentNo}___${cleanName}`;
            }
            await uploadAttachments("HR365HDMTickets", ticketID, attachments);
          }
          setIsOpenReply(false);
          setAttachments([]);
          await sendMail(commentNo);
          console.log("Ticket updated successfully:");
        }
      } catch (error) {
        console.error('Error while creating ticket:', error);
      }
    } else if (replyType === 'private note'){
     
      const commentNo = (CommentsForReply?.length + 1).toString();
      const newComment = {
        CommentNo: commentNo,
        CommentedBy: userDetails?.FullName,
        CommentedById: userDetails?.Email,
        CommentedDate: new Date().toISOString(),
        CommentType: "Private",
        CommentBody: encodeURIComponent(comment).replace(/"/g, '|$|'),
        CommentsTo: ReqEmail,
        CommentsToName: 'Private',
        NoofAttachments: "",
        TimeSpend: TimeSpendValue,
        MarkAsAnswer: MarkAsAnswer,
      };
      const updatedComments = CommentsForReply?.length > 0
        ? [...CommentsForReply, newComment]
        : [newComment];
      setCommentsForReply(updatedComments);
      ticketAction?.push({
        action: "Private",
        oldvalue: '',
        newvalue: comment?.replace('<p', '')?.replace('</p>', '').replace(/<[^>]*>/g, ''),
        modifiedby: userDetails?.FullName,
        date: new Date().toISOString(),
      });
      if (JSON.parse(ticketAction) == null ||
        JSON.parse(ticketAction) == undefined ||
        JSON.parse(ticketAction)?.length == 0
      ) {
      } else {
        ticketAction.push(...JSON.parse(ticketAction))
      }
      let finalTemplate = {
        Comments: JSON.stringify(updatedComments),
        TicketDetails: '',
        LastCommentNo: updatedComments.length.toString(),
        ActionOnTicket: JSON.stringify(ticketAction),
      };
       
      try {
        const updateUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items(${ticketID})`;
       
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
          if (attachments && attachments.length > 0) {
            for (let i = 0; i < attachments.length; i++) {
              const originalName = attachments[i].name || "file";
              const cleanName = originalName.replace(
                /[`~!@#$%^&*()|+\=?;:'",<>\\\/{}\[\]]/g,
                "_"
              );
              attachments[i].name = `${commentNo}___${cleanName}`;
            }
            await uploadAttachments("HR365HDMTickets", ticketID, attachments);
          }
          setIsOpenReply(false);
          setAttachments([]);
          console.log("Ticket updated successfully:");
        }
      } catch (error) {
        console.error('Error while creating ticket:', error);
      }
    }
  }
  
  return (
    <KeyboardAvoidingView 
          style={{ flex: 1 }} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        > 
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{}}
          keyboardShouldPersistTaps="always"
        >
          <TouchableWithoutFeedback onPress={closeAllDropdowns}>
            <View style={[styles.container, { flexGrow: 1 }]}>
              <View style={[styles.row, {marginVertical: 6}]}>
                <Text style={styles.seqNumber}>{ticketSQNo}</Text>
                <Text style={styles.dateText}>{moment(ticketData?.TicketCreatedDate).format("MM/DD HH:mm")}</Text>
              </View>
              <View style={styles.card}>
                <View style={[styles.row, {marginBottom: 8}]}>
                  <TouchableOpacity>
                    <Feather name="download" size={22} color="#026367" />
                  </TouchableOpacity>
                  <View style={[styles.badge, { backgroundColor: '#ffebc9' }]}>
                    <Text style={styles.badgeText}>{ticketData?.Priority}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#ffebc9' }]}>
                    <Text style={styles.badgeText}>{ticketData?.Status}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#ffebc9' }]}>
                    <Text style={styles.badgeText}>{ticketData?.RequestType}</Text>
                  </View>
                  <TouchableOpacity style={styles.iconButton} onPress={openEditModal}>
                    <Feather name="edit-2" size={20} color="#026367" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.subtitle}>{ticketTitle}</Text>
                <View style={styles.row}>
                  <Text></Text>
                  <Text style={styles.halfText}>{DeptCode}</Text>
                  {/* <Text style={styles.halfText}>AC</Text> */}
                  <Text style={styles.halfText}>{ticketData?.Services}</Text>
                </View>
              </View>
              <View style={[styles.row, {marginBottom: 8}]}>
                <View style={styles.personaRow}>
                  <Persona
                    name={ticketData?.RequesterName}
                    mail={ReqEmail}
                  />
                  <Text> describes as</Text>
                </View>
                <TouchableOpacity style={[styles.row, {paddingHorizontal: 10}]} onPress={() => setShowCCModal(true)}>
                  <Text style={styles.ccText}>CC</Text>
                  <View>
                    <Icon name="chevron-up-outline" size={20} color="#026367" />
                    <Icon name="chevron-down-outline" size={20} color="#026367" />
                  </View>
                </TouchableOpacity>
              </View>
              <RichEditor
                ref={descriptionRef}
                style={styles.descriptionBox}
                placeholder={"Enter ticket description..."}
                placeholderTextColor="#333333"
                initialContentHTML={ticketData?.TicketDescription ? `<p>${ticketData.TicketDescription}</p>` : ''}
                enabled={false}
                disabled
                editorStyle={{
                  backgroundColor: "#fff",
                  color: "#333333",
                  placeholderColor: "#333333",
                  cssText: "body {font-family: Roboto; font-size: 16px;}",
                }}
              />
              {/* Comments */}
              {
                CommentsForReply?.length > 0 &&
                CommentsForReply?.map((item, index)=> {
                  const body = decodeURIComponent(item?.CommentBody?.replace('|$|', '"'))
                        ?.replace(/<p[^>]*>/g, '\n')
                        .replace(/<br[^>]*>/g, '\n')
                        .replace(/<[^>]*>/g, '')
                        .replace(/&nbsp;/g, ' ')
                        .replace(/\n\s*\n/g, '\n')
                        .trim();
                  const isCommentTypePrivate = item?.CommentType == "Private" ? true : false;
                  if (isCommentTypePrivate && settings?.PrivateNoteShowSetting !== "On") return null;

                  const commentAttachments = CommentsAttachments?.filter(att => att.fileName.startsWith(`${item.CommentNo}___`));
                  return (
                    <View key={index + 1}>
                      <View style={styles.commentCard} >
                        <View style={styles.commentCardHeadRow}>
                            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                              {
                                isCommentTypePrivate ?
                                <Text style={styles.commentTitle}>
                                  {item?.CommentedBy} added a private note
                                </Text>
                                : <Text style={styles.commentTitle}> {item?.CommentedBy} replied to {item?.CommentsToName}</Text>
                              }
                              {
                                isCommentTypePrivate &&
                                <View style={{ alignItems: "center", justifyContent: "flex-start", marginLeft: 4 }}>
                                  <Ionicons name="lock-closed" size={16} color="#000" />
                                </View>
                              }
                            
                            </View>
                            <Text>{moment(item?.CommentedDate)?.format(settings?.Dateformat || 'MM/DD/YYYY')}</Text>
                        </View>
                        <View style={styles.commentBox}>
                          <Text style={{fontFamily: 'Roboto-Regular'}}>{body}</Text>
                        </View>
                        <Text style={styles.commentNo}>#{item?.CommentNo}</Text>
                      </View>
                      {commentAttachments?.length > 0 && (
                        <View style={styles.attachmentsSection}>
                          <View style={styles.attachmentsList}>
                            {commentAttachments?.map((att, attIndex) => {
                              const displayName = att.fileName.split('___')[1] || att.fileName;
                              return (
                                <TouchableOpacity
                                  key={attIndex}
                                  onPress={() => downloadSingle(att.fileName)}
                                >
                                  <Text style={styles.attachmentLinkText}>{displayName}{" "}{" "}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                          <TouchableOpacity
                            onPress={() => downloadAll(commentAttachments)}
                          >
                            <Feather name="download" size={22} color="#026367" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )
                })
              }
              {
                !isOpenReply &&
                  <View style={[styles.actionCard, {marginBottom: !isOpenReply && 30,}]}>
                    <View style={styles.actionRow}>
                      <View style={styles.leftActions}>
                        <TouchableOpacity style={styles.actionButton} onPress={()=> {
                            setIsOpenReply(true);
                            setReplyType("reply");
                          }}>
                          <Ionicons name="arrow-back" size={20} color="#352f2fff" />
                          <Text style={styles.actionText}>Reply</Text>
                        </TouchableOpacity>
                        {
                          isOpenReply &&
                          <TouchableOpacity style={styles.actionButton} onPress={()=> {
                            setIsOpenReply(false)
                            setReplyType("");
                          }}>
                            <Ionicons name="close" size={20} color="#352f2fff" />
                            <Text style={styles.actionText}>Close</Text>
                          </TouchableOpacity>
                        }
                        <TouchableOpacity style={styles.actionButton} onPress={()=> {
                            setIsOpenReply(true)
                            setReplyType("private note");
                          }}>
                          <Ionicons name="document-text-outline" size={20} color="#352f2fff" />
                          <Text style={styles.actionText}>Private Note</Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <TouchableOpacity onPress={toggleMenu}>
                          <Feather name="more-vertical" size={22} color="#352f2fff" />
                        </TouchableOpacity>
                        {menuVisible && (
                          <View style={styles.dropdownMenu}>
                            <TouchableOpacity style={styles.dropdownItem} onPress={()=> {
                              setISConsultant(true);
                              setIsOpenReply(true);
                              closeMenu();
                              }}>
                              <Ionicons name="chatbox-ellipses-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                              <Text style={styles.dropdownText}>Consult</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dropdownItem} onPress={()=>{
                              setISTransfer(true);
                              setIsOpenReply(true);
                              closeMenu();
                            }}>
                              <Ionicons name="swap-horizontal-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                              <Text style={styles.dropdownText}>Transfer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dropdownItem} onPress={closeMenu}>
                              <Ionicons name="git-merge-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                              <Text style={styles.dropdownText}>Merge</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dropdownItem} onPress={closeMenu}>
                              <Ionicons name="cut-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                              <Text style={styles.dropdownText}>Split</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dropdownItem} onPress={closeMenu}>
                              <Ionicons name="arrow-up-circle-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                              <Text style={styles.dropdownText}>Escalate</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dropdownItem} onPress={()=> {
                              closeMenu();
                              setShowSubTicketModal(true);
                            }}>
                              <Ionicons name="layers-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                              <Text style={styles.dropdownText}>Subticket</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dropdownItem} onPress={closeMenu}>
                              <Ionicons name="eye-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                              <Text style={styles.dropdownText}>Review</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                }
                {
                  isOpenReply &&
                  <View>
                    {
                      isConsult &&
                        <View style={{width: '100%', marginBottom: 10,}}>
                          <Text style={styles.label}>Agent <Text style={styles.requredStar}>*</Text></Text>
                          <PeoplePickerMain
                            fieldName="Consultant"
                            values={{ Consultant: consultant }}
                            setFieldValue={handleConsultant}
                          />
                        </View>
                    }
                    {
                      isTransfer &&
                        <View style={{width: '100%', marginBottom: 10,}}>
                          <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholder}
                            selectedTextStyle={styles.selectedText}
                            data={departmentsOptions}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Teams"
                            search={Array.isArray(departmentsOptions) && departmentsOptions?.length > 0}
                            searchPlaceholder="Search..."
                            value={selectedTeams}
                            onChange={(item) => {
                              setSelectedTeams(item.value)
                            }}
                            renderRightIcon={() => (
                              <Ionicons name="chevron-down" size={18} color="#333" />
                            )}
                            containerStyle={styles.dropdownContainer}
                            itemTextStyle={styles.dropdownItems}
                          />
                          <PeoplePickerMain
                            fieldName="Consultant"
                            values={{ Consultant: consultant }}
                            setFieldValue={handleConsultant}
                          />
                        </View>
                    }
                    <View style={[styles.editorBox, {minHeight: replyType === 'private note' ? 140 : 'unset'}]}>
                      <View style={styles.replyHeader}>
                        <TouchableOpacity onPress={()=>{setShowReplyCCModal(true)}}>
                          <Ionicons name="person-outline" size={20} color="#352f2fff"/>
                        </TouchableOpacity>
                      </View>
                      <RichEditor
                        ref={richTextRef}
                        androidLayerType="software"
                        style={styles.richInput}
                        useContainer={true}
                        enterKeyHint="send"
                        initialFocus={true}
                        removeExtraSpaces={true}
                        placeholder=""
                        placeholderTextColor="#333333"
                        initialContentHTML={comment}
                        onChange={(text) => setComment(text)}
                        editorStyle={{
                          backgroundColor: "#fff",
                          color: "#333333",
                          placeholderColor: "#333333",
                          cssText: "body {font-family: Roboto; font-size: 16px;}",
                        }}
                      />
                    </View>
                    <View style={[styles.attachmentRow,{ marginTop: 10, }]}>
                      <TouchableOpacity onPress={pickAttachment} style={styles.attachmentButton}>
                        <Text style={styles.attachmentText}>Attachments</Text>
                        <Ionicons name="attach" size={20} color="#026367" />
                      </TouchableOpacity>
                    </View>
                    {attachments?.length > 0 && (
                      <View style={[styles.attachmentsContainer, { marginTop: 10 }]}>
                        {attachments?.map((item, index) => (
                          <View key={index} style={styles.attachmentItem}>
                            <Ionicons name="document-outline" size={18} color="#026367" />
                            <Text style={styles.attachmentName}>{item.name}</Text>
                            <TouchableOpacity onPress={() => removeAttachment(index)} style={styles.removeIcon}>
                              <Ionicons name="close" size={21} color="#026367" />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    <View style={[styles.row, {marginTop: 16,marginBottom: keyboardVisible ? 122 : 24}]}>
                      <View>
                        <TouchableOpacity style={styles.discardButton} onPress={()=> {
                          setIsOpenReply(false);
                          setReplyType("");
                          setISConsultant(false);
                          setISTransfer(false);
                        }}>
                          <Ionicons name="close" size={20} color="#352f2fff" />
                          <Text style={styles.discardText}>Discard</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.row}>
                        <TouchableOpacity style={styles.saveReplyButton} onPress={handleReply}>
                          <Text style={styles.saveReplyText}>Save</Text>
                        </TouchableOpacity>
                        <View style={{position: 'relative'}}>
                          <TouchableOpacity onPress={toggleReplyOptions} style={styles.saveOptions}>
                            <Icon name="chevron-down-outline" size={20} color="#fff" />
                          </TouchableOpacity>
                          {replyOptionsVisible && (
                            <View style={[styles.dropdownReplyMenu]}>
                              <TouchableOpacity style={styles.dropdownReplyItem} onPress={(e) => {
                                e.stopPropagation();
                                closeReplyReplyOptions();
                              }}>
                                <Text style={[styles.dropdownReplyText]}>Update and set a status as Waiting on Customer</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.dropdownReplyItem} onPress={(e) => {
                                e.stopPropagation();
                                closeReplyReplyOptions();
                              }}>
                                <Text style={[styles.dropdownReplyText]}>Update and set a status as Closed</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.dropdownReplyItem} onPress={(e) => {
                                e.stopPropagation();
                                closeReplyReplyOptions();
                              }}>
                                <Text style={[styles.dropdownReplyText]}>Update and set a status as Waiting on Third Party</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.dropdownReplyItem} onPress={(e) => {
                                e.stopPropagation();
                                closeReplyReplyOptions();
                              }}>
                                <Text style={[styles.dropdownReplyText]}>Update and set a status as Unassigned</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.dropdownReplyItem} onPress={(e) => {
                                e.stopPropagation();
                                closeReplyReplyOptions();
                              }}>
                                <Text style={[styles.dropdownReplyText]}>Update and set a status as Resolved</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.dropdownReplyItem} onPress={(e) => {
                                e.stopPropagation();
                                closeReplyReplyOptions();
                              }}>
                                <Text style={[styles.dropdownReplyText]}>Update and set a status as Open</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.dropdownReplyItem} onPress={(e) => {
                                e.stopPropagation();
                                closeReplyReplyOptions();
                              }}>
                                <Text style={[styles.dropdownReplyText]}>Update and set a status as Pending</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                }
              </View>
            </TouchableWithoutFeedback>
        </ScrollView>
        {/* CC Modal - moved outside ScrollView */}
        <Modal
          visible={showCCModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCCModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={{width: '100%', marginBottom: 10}}>
                <PeoplePickerMain
                  fieldName="Cc"
                  values={{ Cc: ccInput }}
                  setFieldValue={handleSetCcValue}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveCC}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelCC}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* replycc */}
        <Modal
          visible={showReplyCCModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReplyCCModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={{width: '100%', marginBottom: 10,}}>
                <PeoplePickerMain
                  fieldName="Cc"
                  values={{ Cc: replyCcInput }}
                  setFieldValue={handleSetReplyCcValue}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveReplyCC}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleReplyCancelCC}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Edit Ticket Modal - moved outside ScrollView */}
        <Modal
          visible={showEditModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowEditModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContainer]}>
              <EditTicket ticketData={ticketData} handleSaveEdit={handleSaveEdit} handleCancelEdit={handleCancelEdit}/>
            </View>
          </View>
        </Modal>
        {/* SubTicket Modal - moved outside ScrollView */}
        <Modal
          visible={showSubTicketModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowSubTicketModal(false)}
        >
          <NotificationProvider>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContainer]}>
                <CreateTicket ticketData={ticketData} handleSaveSubTicket={handleSaveSubTicket} handleCancelSubTicket={handleCancelSubTicket}/>
              </View>
            </View>
          </NotificationProvider>
        </Modal>
    </KeyboardAvoidingView>
  );
};
export default TicketDetails;
const styles = StyleSheet.create({
  container: {
    padding: 6,
    backgroundColor: '#f5f5f5'
  },
  card: {
    borderWidth: 1,
    borderColor: '#34979aff',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#bcd5d7ff',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  personaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  ccText: {
    fontFamily: 'Roboto-Bold',
    marginRight: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center'
  },
  badgeText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'Roboto-Medium'
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#026367',
    marginVertical: 8
  },
  halfText: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: '#026367',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Roboto',
    color: '#333',
    fontWeight: 600,
  },
  seqNumber: {
    fontSize: 15,
    fontFamily: 'Roboto-Bold',
    color: '#333',
  },
  value: {
    fontSize: 15,
    fontFamily: 'Roboto',
    color: '#333'
  },
  descriptionBox: {
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 100,
  },
  actionCard: {
    padding: 10,
    marginTop: 6,
    backgroundColor: '#efefef',
    borderColor: '#e2e2e2',
    borderWidth: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  actionText: {
    marginLeft: 4,
    fontSize: 15,
    color: '#352f2fff',
    fontWeight: 'Roboto-Bold'
  },
  discardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#34979aff',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#bcd5d7ff',
  },
  discardText: {
    marginLeft: 4,
    fontSize: 15,
    color: '#352f2fff',
    fontWeight: 'Roboto-Bold'
  },
  saveReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#026367',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#026367',
  },
  saveReplyText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'Roboto-Bold'
  },
  dropdownMenu: {
    position: 'absolute',
    bottom: 25,
    width: 110,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  dropdownReplyMenu: {
    position: 'absolute',
    top: -280,
    width: 360,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    elevation: 4,
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999
  },
  dropdownReplyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  dropdownReplyText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Roboto-Regular',
  },
  dropdownIcon: {
    marginRight: 8
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Roboto-Medium',
  },
  editorBox: {
    marginTop: 0,
  },
  heading: {
    color: "#333333",
    fontWeight: 'Roboto-Bold',
    fontSize: 18,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  attachmentText: {
    marginLeft: 6,
    fontSize: 17,
    color: '#026367',
    fontFamily: 'Roboto-Medium',
  },
  saveOptions: {
    padding: 10,
    marginLeft: 6,
    backgroundColor: '#026367',
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
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'Roboto',
    color: '#333',
    flex: 1
  },
  removeIcon: {
    marginLeft: 8
  },
  richInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  iconButton: {
    alignSelf: 'flex-end',
  },
  selectedText: {
    fontSize: 16,
    fontWeight: 'Roboto-Bold',
    color: '#026367',
    marginBottom: 8,
    marginTop: 10,
  },
  attachmentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'Roboto-Bold',
    marginBottom: 15,
    color: '#333',
  },
  ccInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
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
  label: {
    fontFamily: "Roboto",
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 1,
    marginBottom: 5,
    color: "#333333",
  },
  requredStar: {
    color: "#a4262c",
  },
  commentCard: {
    borderColor: '#e2e2e2',
    borderWidth: 1,
    marginBottom: 12,
  },
  commentBox: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  commentNo: {
    fontSize: 12,
    right: 6,
    textAlign: 'right',
    position: 'absolute',
    bottom: 5,
  },
  commentCardHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    backgroundColor: '#efefef',
    borderColor: '#e2e2e2',
    padding: 10,
    borderBottomWidth: 1,
  },
  commentTitle: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  attachmentsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  attachmentsList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  attachmentLinkText: {
    fontSize: 14,
    color: '#026367',
    fontFamily: 'Roboto-Regular',
  },
  downloadAllButton: {
    padding: 5,
    marginLeft: 10,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'right',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    backgroundColor: '#efefef',
    borderColor: '#e2e2e2',
    padding: 10,
    borderBottomWidth: 1,
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
  dropdownItems: {
    color: "#333333",
    fontFamily: "Roboto",
    fontSize: 16,
  },
  dropdownItemContainer: {
    padding: 0,
  },
});

