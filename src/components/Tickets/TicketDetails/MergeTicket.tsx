import React from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useMyOpenRequestsTickets } from "../../../hooks/useTickets";
import { Dropdown } from "react-native-element-dropdown";
import { useNotification } from "../../Alerts/NotificationProvider";

export default function MergeTicket({
  onConfirm,
  onCancel,
  ticketValue,
  setTicketValue,
  selectedTicket,
  setSelectedTicket,
  mergeCommentValue,
  setMergeCommentValue,
}) {
  const { data: TicketData } = useMyOpenRequestsTickets();
  const { show } = useNotification();

  const TicketOptions = TicketData?.map(i => ({
    label: `${i.TicketSeqnumber}-${i.Services}`,
    value: i.TicketSeqnumber,
    ...i,
  }));

  const handleConfirmPress = () => {
    if (!ticketValue) {
      show({
        type: "error",
        title: "Error!",
        message: "Please select a ticket to merge.",
        duration: 3000,
        buttonEnabled: false,
      });
      return;
    }
    onConfirm();
  };

  return (
    <View style={styles.modalContent}>

      <Text style={styles.label}>
        Enter Ticket ID to merge into. The requester will be added as Cc to the target ticket
        <Text style={styles.requiredStar}> *</Text>
      </Text>

      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        data={TicketOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Ticket"
        searchPlaceholder="Search by ticket ID..."
        value={ticketValue}
        onChange={(item) => {
          setTicketValue(item.value);
          setSelectedTicket(item);
        }}
        renderRightIcon={() => (
          <Ionicons name="chevron-down" size={18} color="#333" />
        )}
        containerStyle={styles.dropdownContainer}
        itemTextStyle={styles.dropdownItems}
      />

      <Text style={styles.label}>Comments</Text>
      <TextInput
        style={[styles.textInput, { minHeight: 80 }]}
        placeholder="Write your comments..."
        value={mergeCommentValue}
        onChangeText={setMergeCommentValue}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleConfirmPress} style={styles.confirmButton}>
          <Text style={[styles.buttonText, styles.confirmText]}>Merge</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
    alignSelf: "flex-start",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    height: 44,
    backgroundColor: "#fff",
    marginBottom: 6,
    width: "100%",
  },
  placeholder: {
    color: "#999",
  },
  selectedText: {
    color: "#333",
    fontSize: 16,
  },
  dropdownContainer: {
    backgroundColor: "#fff",
    padding: 0,
  },
  dropdownItems: {
    color: "#333",
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    marginBottom: 6,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#026367",
    paddingVertical: 10,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "#026367",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#999",
    backgroundColor: "#f9f9f9",
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Roboto-Medium",
  },
  confirmText: {
    color: "#fff",
  },
  cancelText: {
    color: "#333",
  },
  requiredStar: {
    color: "#a4262c",
  },
});
