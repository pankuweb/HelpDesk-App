import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ConfirmModal({ message, visible, onYes, onCancel }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: 24,
            alignItems: "center",
          }}
        >

          <Ionicons
            name="warning-outline"
            size={50}
            color="#777"
            style={{ marginBottom: 10 }}
          />

          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              textAlign: "center",
              marginBottom: 20,
              color: "#333",
            }}
          >
            {message}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={onYes}
              style={{
                flex: 1,
                backgroundColor: "#026367",
                paddingVertical: 10,
                paddingHorizontal: 22,
                marginRight: 10,
                borderWidth: 1.5,
                borderColor: "#026367",
                alignSelf: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15, textAlign: "center" }}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 22,
                borderWidth: 1.5,
                borderColor: "#999",
                alignSelf: "center",
              }}
            >
              <Text style={{ fontSize: 15, color: "#333", textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}