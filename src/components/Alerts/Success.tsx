import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface SuccessProps {
  message: string;
  visible: boolean;
  onHide?: () => void;
}

const Success: React.FC<SuccessProps> = ({ message, visible, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          if (onHide) onHide();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999, // ensures it floats above everything
  },
  container: {
    backgroundColor: "#d1e7dd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Android shadow
    minWidth: "70%",
    alignItems: "center",
  },
  text: {
    color: "#0f5132",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
});
