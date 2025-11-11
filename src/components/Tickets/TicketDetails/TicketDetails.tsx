import React, { useState, useRef, useEffect } from 'react';
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

const TicketDetails = ({ route }) => {
  const { ticketId, ticketData } = route.params;
  console.log(ticketData, 'route=====>>>>>>');
  
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [replyOptionsVisible, setReplyOptionsVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [isReply, setIsReply] = useState(false);
  const [showCCModal, setShowCCModal] = useState(false);
  const [ccInput, setCcInput] = useState('');

  const richTextRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (descriptionRef.current && ticketData?.TicketDescription) {
      const content = `<p>${ticketData.TicketDescription}</p>`;
      descriptionRef.current.setContentHTML(content);
    }
  }, [ticketData?.TicketDescription]);

  useEffect(() => {
    if (isReply && (!comment || comment.trim() === '')) {
      const defaultContent = `
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>Regards</p>
        <p style="margin-bottom: 4px;">Sachin Gagneja</p>
        <p style="margin-bottom: 4px;">Accountant</p>
        <p style="margin-bottom: 0;">917009939098</p>
      `;
      setComment(defaultContent);
      if (richTextRef.current) {
        richTextRef.current.setContentHTML(defaultContent);
      }
    }
  }, [isReply, comment]);

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

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
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

              <TouchableOpacity style={styles.iconButton}>
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
            editorStyle={{
              backgroundColor: "#fff",
              color: "#333333",
              placeholderColor: "#333333",
              cssText: "body {font-family: Roboto; font-size: 16px;}",
            }}
          />
          <View style={styles.actionCard}>
            <View style={styles.actionRow}>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.actionButton} onPress={()=> setIsReply(true)}>
                  <Ionicons name="arrow-back" size={20} color="#352f2fff" />
                  <Text style={styles.actionText}>Reply</Text>
                </TouchableOpacity>
                {
                  isReply && 
                  <TouchableOpacity style={styles.actionButton} onPress={()=> setIsReply(false)}>
                    <Ionicons name="close" size={20} color="#352f2fff" />
                    <Text style={styles.actionText}>Close</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity style={styles.actionButton}>
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
                    <Pressable style={styles.dropdownItem} onPress={closeMenu}>
                      <Ionicons name="chatbox-ellipses-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                      <Text style={styles.dropdownText}>Consult</Text>
                    </Pressable>

                    <Pressable style={styles.dropdownItem} onPress={closeMenu}>
                      <Ionicons name="swap-horizontal-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                      <Text style={styles.dropdownText}>Transfer</Text>
                    </Pressable>

                    <Pressable style={styles.dropdownItem} onPress={closeMenu}>
                      <Ionicons name="git-merge-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                      <Text style={styles.dropdownText}>Merge</Text>
                    </Pressable>

                    <Pressable style={styles.dropdownItem} onPress={closeMenu}>
                      <Ionicons name="cut-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                      <Text style={styles.dropdownText}>Split</Text>
                    </Pressable>

                    <Pressable style={styles.dropdownItem} onPress={closeMenu}>
                      <Ionicons name="arrow-up-circle-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                      <Text style={styles.dropdownText}>Escalate</Text>
                    </Pressable>

                    <Pressable style={styles.dropdownItem} onPress={closeMenu}>
                      <Ionicons name="layers-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                      <Text style={styles.dropdownText}>Subticket</Text>
                    </Pressable>

                    <Pressable style={styles.dropdownItem} onPress={closeMenu}>
                      <Ionicons name="eye-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                      <Text style={styles.dropdownText}>Review</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </View>

          {
            isReply && 
            <View>
              <View style={styles.editorBox}>
                <RichEditor
                  ref={richTextRef}
                  style={styles.richInput}
                  placeholder="Write your reply..."
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
                  <TouchableOpacity style={styles.discardButton} onPress={()=> setIsReply(false)}>
                    <Ionicons name="close" size={20} color="#352f2fff" />
                    <Text style={styles.discardText}>Discard</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity style={styles.saveReplyButton} onPress={()=> setIsReply(false)}>
                    <Text style={styles.saveReplyText}>Save</Text>
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity onPress={toggleReplyOptions}>
                      <Feather name="more-vertical" size={22} color="#352f2fff" />
                    </TouchableOpacity>

                    {replyOptionsVisible && (
                      <View style={styles.dropdownMenu}>
                        <Pressable style={styles.dropdownItem} onPress={closeReplyReplyOptions}>
                          <Ionicons name="chatbox-ellipses-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                          <Text style={styles.dropdownText}>Consult</Text>
                        </Pressable>

                        <Pressable style={styles.dropdownItem} onPress={closeReplyReplyOptions}>
                          <Ionicons name="swap-horizontal-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                          <Text style={styles.dropdownText}>Transfer</Text>
                        </Pressable>

                        <Pressable style={styles.dropdownItem} onPress={closeReplyReplyOptions}>
                          <Ionicons name="git-merge-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                          <Text style={styles.dropdownText}>Merge</Text>
                        </Pressable>

                        <Pressable style={styles.dropdownItem} onPress={closeReplyReplyOptions}>
                          <Ionicons name="cut-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                          <Text style={styles.dropdownText}>Split</Text>
                        </Pressable>

                        <Pressable style={styles.dropdownItem} onPress={closeReplyReplyOptions}>
                          <Ionicons name="arrow-up-circle-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                          <Text style={styles.dropdownText}>Escalate</Text>
                        </Pressable>

                        <Pressable style={styles.dropdownItem} onPress={closeReplyReplyOptions}>
                          <Ionicons name="layers-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                          <Text style={styles.dropdownText}>Subticket</Text>
                        </Pressable>

                        <Pressable style={styles.dropdownItem} onPress={closeReplyReplyOptions}>
                          <Ionicons name="eye-outline" size={16} color="#026367" style={styles.dropdownIcon} />
                          <Text style={styles.dropdownText}>Review</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          }
        </ScrollView>

        <Modal
          visible={showCCModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCCModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TextInput
                style={styles.ccInput}
                placeholder="Enter email address..."
                value={ccInput}
                onChangeText={setCcInput}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
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
    fontFamily: 'Roboto',
    fontWeight: 700,
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
    fontWeight: 'Roboto-Regular' 
  },
  subtitle: { 
    fontSize: 14, 
    fontFamily: 'Roboto', 
    color: '#333', 
    fontWeight: 700,
    marginVertical: 8 
  },
  halfText: { 
    fontSize: 14, 
    fontFamily: 'Roboto', 
    color: '#026367', 
    fontWeight: 'bold', 
  },
  dateText: { 
    fontSize: 14, 
    fontFamily: 'Roboto', 
    color: '#333', 
    fontWeight: 600, 
  },
  seqNumber: { 
    fontSize: 15, 
    fontFamily: 'Roboto', 
    color: '#333', 
    fontWeight: 700, 
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
    fontWeight: 'bold' 
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
    fontWeight: 600 
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
    fontWeight: 600 
  },
  dropdownMenu: { 
    position: 'absolute', 
    top: 25, 
    width: 110, 
    right: 0, 
    backgroundColor: '#fff',
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 6, 
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
  dropdownIcon: { 
    marginRight: 8 
  },
  dropdownText: { 
    fontSize: 14, 
    color: '#026367', 
    fontWeight: '500' 
  },
  editorBox: { 
    marginTop: 10,
  },
  heading: { 
    color: "#333333", 
    fontWeight: "600", 
    fontSize: 18 
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
    fontWeight: '500' 
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: '500',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 16,
  },
});