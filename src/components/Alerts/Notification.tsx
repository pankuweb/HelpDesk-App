import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

interface NotificationProps {
  title?: string;
  message?: string;
  type?: 'success' | 'error';
  visible: boolean;
  duration?: number;
  buttonEnabled?: boolean;
  onHide?: () => void;
}

const Notification: React.FC<NotificationProps> = ({ 
  title, 
  message, 
  type = 'success',
  visible, 
  duration = 2200, 
  buttonEnabled = false, 
  onHide 
}) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0));
  const [overlayAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0);
      overlayAnim.setValue(0);

      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          Animated.timing(overlayAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            onHide?.();
          });
        });
      }, duration);

      return () => clearTimeout(timer);
    } else {
      overlayAnim.setValue(0);
    }
  }, [visible, duration, fadeAnim, scaleAnim, overlayAnim, onHide]);

  const handleManualHide = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        onHide?.();
      });
    });
  };

  if (!visible) return null;

  const isSuccess = type === 'success';
  const iconName = isSuccess ? 'check' : 'error-outline';
  const iconColor = isSuccess ? '#00cf6eff' : '#e80017ff';
  const textColor = isSuccess ? '#000' : '#000';
  const borderColor = isSuccess ? '#fff' : '#fff';

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.overlayBackground,
          { 
            opacity: overlayAnim 
          }
        ]}
      />
      <Animated.View 
        style={[
          styles.container, 
          { 
            opacity: fadeAnim, 
            transform: [{ scale: scaleAnim }],
            borderColor,
          }
        ]}
      >
        <Icon name={iconName} size={32} color={iconColor} style={styles.icon} />
        {title && <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
        {message && <Text style={[styles.text, { color: textColor }]}>{message}</Text>}
        {buttonEnabled && (
          <TouchableOpacity style={styles.button} onPress={handleManualHide}>
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, 
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    borderWidth: 2,
    shadowRadius: 8,
    elevation: 8,
    minWidth: "70%",
    alignItems: "center",
    borderRadius: 12,
    zIndex: 10000,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});