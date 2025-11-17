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

const TicketDetails = ({ route }) => {
  const { ticketData } = route.params;
  
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

  const richTextRef = useRef(null);
  const descriptionRef = useRef(null);

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
    if (descriptionRef.current && ticketData?.TicketDescription) {
      const content = `<p>${ticketData.TicketDescription}</p>`;
      descriptionRef.current.setContentHTML(content);
    }
  }, [ticketData?.TicketDescription]);

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

  return (
    <TouchableWithoutFeedback onPress={closeAllDropdowns}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
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
          {
            !isOpenReply && 
              <View style={styles.actionCard}>
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
                <View style={[styles.row, {marginTop: 16,}]}>
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
                    <TouchableOpacity style={styles.saveReplyButton} onPress={()=> setIsOpenReply(false)}>
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
        </ScrollView>
        {/* CC Modal */}
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

        {/* Edit Ticket Modal*/}
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
    </TouchableWithoutFeedback>
  );
};

export default TicketDetails;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
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
    top: 25, 
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
    top: -260, 
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
});