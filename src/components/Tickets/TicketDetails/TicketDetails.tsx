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
  Modal,
  TextInput,
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
import { NotificationProvider } from '../../Alerts/NotificationProvider';
import PeoplePicker from '../../PeoplePicker/PeoplePicker';
import PeoplePickerMain from '../../PeoplePicker/PeoplePickerMain';
import { useFetchEmailTemplates, useFetchSettings } from '../../../hooks/useRequests';
import { RootState } from '../../../redux/store';
import axios from 'axios';
import { fetchAttachments, uploadAttachments } from '../../../backend/RequestAPI';


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
  
  const navigation = useNavigation();
  const userDetails = useSelector((state) => state?.login?.user);
  
  const [menuVisible, setMenuVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [replyOptionsVisible, setReplyOptionsVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [isOpenReply, setIsOpenReply] = useState(false);
  const [replyType, setReplyType] = useState('');
  const [showCCModal, setShowCCModal] = useState(false);
  const [ccInput, setCcInput] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSubTicketModal, setShowSubTicketModal] = useState(false);
  const [consultant, setConsultant] = useState([]);
  const [isConsult, setISConsultant] = useState(false);
  const [preAssignName, setPreAssignName] = useState("");
  const [TimeSpendValue, setTimeSpendValue] = useState();
  const [MarkAsAnswer, setMarkAsAnswer] = useState("No");
  const [CommentsForReply, setCommentsForReply] = useState(JSON.parse(ticketData?.Comments  || "[]"))
  const [CommentsAttachments, setCommentsAttachments] = useState([])
  const [globalMessage, setGlobalMessage] = useState("<p id='Comments10p1144'><br></p>");
  const [SLABreachData, setSLABreachData] = useState(isStringValidated(ticketData?.SLABreachData) ? JSON.parse(ticketData?.SLABreachData) : [{
    SLAStatus: '',
    TimeBreached: '',
    BreachReason: '',
    FirstResponseTime: '',
  }]);
  const [SLAResponseInfoData, setSLAResponseInfoData] = useState(isStringValidated(ticketData?.SLAResponseInfo) ? JSON.parse(ticketData?.SLAResponseInfo) : []);
  const [SLAResponseDone, setSLAResponseDone] = useState(isStringValidated(ticketData?.SLAResponseDone) ? ticketData?.SLAResponseDone : '',);
  
  const richTextRef = useRef(null);
  const descriptionRef = useRef(null);

  const { isLoading: isEmailTemplatesLoading, refetch: refetchEmailTemplates } = useFetchEmailTemplates();

  const emailTemplatesListData = useSelector((state: RootState) => state.requests.emailTemplates);
  const baseURL = useSelector((state: RootState) => state?.login?.tanent);
  const token: any = useSelector((state: RootState) => state?.login?.token);
  console.log(emailTemplatesListData, 'setting------>>>>');


  const handleSetCcValue = useCallback((fieldName, newValue) => {
    if (fieldName === 'Cc') {
      setCcInput(newValue);
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
        ticketData?.ID
      );
      setCommentsAttachments(data);
      console.log("Attachments:", CommentsForReply);
    };

    loadAttachments();
  }, []);


  useEffect(() => {
    if (descriptionRef.current && ticketData?.TicketDescription) {
      const content = `<p>${ticketData.TicketDescription}</p>`;
      descriptionRef.current.setContentHTML(content);
    }
  }, [ticketData?.TicketDescription]);

  useEffect(() => {
    setCommentsForReply(JSON.parse(ticketData?.Comments  || "[]"));
    
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
        <p>${ticketData?.TicketSeqnumber || ``}</p>
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
  }, [isOpenReply, replyType, userDetails]); // Removed 'comment' from dependencies to avoid potential loops

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

  const handleReply = async () => {
    let CommentsTo = '';
    let CommentsToEmail = '';
    let ticketAction = [];
    let SLAResponse: '';
    
    if(replyType === 'reply'){
      if (ticketData?.RequesterEmail?.toLowerCase() == userDetails?.Email?.toLowerCase()) {
        CommentsTo = preAssignName == null || preAssignName == undefined || preAssignName == "" ? "this ticket" : preAssignName;
        CommentsToEmail = preAssignName == null || preAssignName == undefined || preAssignName == "" ? "this ticket" : preAssignName;
      } else {
        CommentsTo = ticketData?.RequesterName;
        CommentsToEmail = ticketData?.RequesterEmail;
      };

      const commentNo = (CommentsForReply?.length + 1).toString();
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

      if (CommentsToEmail == ticketData?.RequesterEmail && SLAResponseDone == "No") {
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
        const updateUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items(${ticketData?.ID})`;
        
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
            await uploadAttachments("HR365HDMTickets", ticketData?.ID, attachments);
          }
          setIsOpenReply(false);
          setAttachments([]);
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
        CommentsTo: ticketData?.RequesterEmail,
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

      if (JSON.parse(ticketData?.ActionOnTicket) == null ||
        JSON.parse(ticketData?.ActionOnTicket) == undefined ||
        JSON.parse(ticketData?.ActionOnTicket)?.length == 0
      ) {
      } else {
        ticketAction.push(...JSON.parse(ticketData?.ActionOnTicket))
      }

      let finalTemplate = {
        Comments: JSON.stringify(updatedComments),
        TicketDetails: '',
        LastCommentNo: updatedComments.length.toString(),
        ActionOnTicket: JSON.stringify(ticketAction),
      };
        

      try {
        const updateUrl = `${baseURL}/_api/web/lists/getbytitle('HR365HDMTickets')/items(${ticketData?.ID})`;
        
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
            await uploadAttachments("HR365HDMTickets", ticketData?.ID, attachments);
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
    <>
      <View style={{ flex: 1 }}>
        <ScrollView 
          style={{flex: 1}} 
          contentContainerStyle={{}} 
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={closeAllDropdowns}>
            <View style={[styles.container, { flexGrow: 1 }]}>
              <View style={[styles.row, {marginVertical: 6}]}>
                <Text style={styles.seqNumber}>{ticketData?.TicketSeqnumber}</Text>
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

                <Text style={styles.subtitle}>{ticketData?.Title}</Text>

                <View style={styles.row}>
                  <Text style={styles.halfText}>{JSON.parse(ticketData?.TicketProperties)?.[0]?.DepartmentCode}</Text>
                  <Text style={styles.halfText}>AC</Text>
                  <Text style={styles.halfText}>{ticketData?.Services}</Text>
                </View>
              </View>
              <View style={[styles.row, {marginBottom: 8}]}>
                <View style={styles.personaRow}>
                  <Persona
                    name={ticketData?.RequesterName}
                    mail={ticketData?.RequesterEmail}
                  /> 
                  <Text> describes as</Text>
                </View>
                <TouchableOpacity style={[styles.row, {paddingHorizontal: 10}]} onPress={() => setShowCCModal(true)}>
                  <Text style={styles.ccText}>CC</Text>
                  <View>
                    <Icon name="chevron-up-outline" size={20} color="#026367"  />
                    <Icon name="chevron-down-outline" size={20} color="#026367"  />
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
                  return (
                    <View style={styles.commentCard} key={index + 1}>
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
                      <TouchableOpacity onPress={()=> {
                        download image code
                      }}>Download</TouchableOpacity>
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

                            <TouchableOpacity style={styles.dropdownItem} onPress={closeMenu}>
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
                    <View style={[styles.editorBox, {minHeight: replyType === 'private note' ? 100 : 'unset'}]}>
                      <RichEditor
                        ref={richTextRef}
                        style={styles.richInput}
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
                    <View style={[styles.row, {marginTop: 16,marginBottom: 24,}]}>
                      <View>
                        <TouchableOpacity style={styles.discardButton} onPress={()=> {
                          setIsOpenReply(false);
                          setReplyType("");
                          setISConsultant(false);
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
                            <Icon name="chevron-down-outline" size={20} color="#fff"  />
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
              <View style={{width: '100%', marginBottom: 10,}}>
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
          onRequestClose={() => showSubTicketModal(false)}
        >
          <NotificationProvider>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContainer]}>
                <CreateTicket ticketData={ticketData} handleSaveSubTicket={handleSaveSubTicket} handleCancelSubTicket={handleCancelSubTicket}/>
              </View>
            </View>
          </NotificationProvider>
        </Modal>
      </View>
    </>
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
});