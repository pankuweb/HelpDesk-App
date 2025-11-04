import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Pressable, 
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import DocumentPicker from '@react-native-documents/picker';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const TicketDetails = ({ route }) => {
  const { ticketId } = route.params;
  const navigation = useNavigation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [description, setDescription] = useState('');

  const richText = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuVisible(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const pickAttachment = async () => {
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
      });

      if (results && results?.length > 0) {
        setAttachments(prev => [...prev, ...results]);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.log('Attachment Error: ', err);
      }
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenu}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <View style={styles.row}>
              <TouchableOpacity>
                <Feather name="download" size={22} color="#026367" /> 
              </TouchableOpacity>

              <View style={[styles.badge, { backgroundColor: '#FFA500' }]}>
                <Text style={styles.badgeText}>Urgent</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#FFA500' }]}>
                <Text style={styles.badgeText}>Open</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#FFA500' }]}>
                <Text style={styles.badgeText}>Request</Text>
              </View>

              <TouchableOpacity style={styles.iconButton}>
                <Feather name="edit-2" size={20} color="#026367" /> 
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>This is the ticket subtitle</Text>

            <View style={styles.row}>
              <Text style={styles.halfText}>AC</Text>
              <Text style={styles.halfText}>Client Issue</Text>
            </View>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.value}>
              This is the detailed description of the ticket. It explains the issue the client is facing in detail.
            </Text>
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionRow}>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="arrow-back" size={18} color="#fff" />
                  <Text style={styles.actionText}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="close" size={18} color="#fff" />
                  <Text style={styles.actionText}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="document-text-outline" size={18} color="#fff" />
                  <Text style={styles.actionText}>Private Note</Text>
                </TouchableOpacity>
              </View>

              <View>
                <TouchableOpacity onPress={toggleMenu}>
                  <Feather name="more-vertical" size={22} color="#fff" />
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

          <View style={styles.editorBox}>
            <RichEditor
              ref={richText}
              style={styles.richInput}
              placeholder="Write your reply..."
              placeholderTextColor="#333333"
              initialContentHTML={description}
              onChange={(text) => setDescription(text)}
              editorStyle={{
                backgroundColor: "#fff",
                color: "#333333",
                placeholderColor: "#333333",
                cssText: "body {font-family: Roboto; font-size: 16px;}",
              }}
            />
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
                actions.insertVideo,
                actions.insertCode,
                actions.undo,
                actions.redo,
              ]}
              iconMap={{
                [actions.heading1]: () => (
                  <Text style={styles.heading}>H1</Text>
                ),
                [actions.heading2]: () => (
                  <Text style={styles.heading}>H2</Text>
                ),
                [actions.heading3]: () => (
                  <Text style={styles.heading}>H3</Text>
                ),
                [actions.setParagraph]: () => (
                  <Text style={styles.heading}>P</Text>
                ),
                [actions.insertCode]: () => (
                  <Text style={styles.heading}>{`</>`}</Text>
                ),
              }}
              iconTint="#000"
            />
          </View>

          <View style={styles.attachmentRow}>
            <TouchableOpacity onPress={pickAttachment} style={styles.attachmentButton}>
              <Ionicons name="attach" size={20} color="#026367" />
              <Text style={styles.attachmentText}>Add Attachment</Text>
            </TouchableOpacity>
          </View>

          {attachments?.length > 0 && (
            <View style={{ marginTop: 10 }}>
              {attachments.map((item, index) => (
                <View key={index} style={styles.attachmentItem}>
                  <Ionicons name="document-outline" size={18} color="#026367" />
                  <Text style={styles.attachmentName}>{item.name}</Text>
                  <TouchableOpacity onPress={() => removeAttachment(index)} style={styles.removeIcon}>
                    <Ionicons name="close-circle" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TicketDetails;

const styles = StyleSheet.create({
  container: { padding: 6, backgroundColor: '#fff' },
  card: {
    borderWidth: 1, borderColor: '#026367', padding: 12, marginBottom: 16,
    backgroundColor: '#fff', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1,
    shadowRadius: 4, elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, minWidth: 70, alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  subtitle: { fontSize: 14, fontFamily: 'Roboto', color: '#333', marginVertical: 8 },
  halfText: { flex: 1, fontSize: 14, fontFamily: 'Roboto', color: '#026367', fontWeight: 'bold', textAlign: 'left' },
  value: { fontSize: 15, fontFamily: 'Roboto', color: '#000' },
  descriptionBox: { padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#ccc' },
  actionCard: { padding: 10, marginTop: 6, backgroundColor: '#026367' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftActions: { flexDirection: 'row', alignItems: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  actionText: { marginLeft: 4, fontSize: 14, color: '#fff', fontWeight: 'bold' },
  dropdownMenu: {
    position: 'absolute', top: 25, width: 110, right: 0, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#ccc', borderRadius: 6, elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, zIndex: 999,
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 },
  dropdownIcon: { marginRight: 8 },
  dropdownText: { fontSize: 14, color: '#026367', fontWeight: '500' },
  editorBox: { marginTop: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8 },
  heading: { color: "#333333", fontWeight: "600", fontSize: 18 },
  attachmentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  attachmentButton: { flexDirection: 'row', alignItems: 'center' },
  attachmentText: { marginLeft: 6, fontSize: 14, color: '#026367', fontWeight: '500' },
  attachmentItem: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  attachmentName: { marginLeft: 6, fontSize: 14, color: '#333', flex: 1 },
  removeIcon: { marginLeft: 8 },
});
