import * as React from 'react';
import { Text, View, TouchableOpacity, Linking, StyleSheet, Platform } from 'react-native';
import config from '../../../config';

function AboutScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text allowFontScaling={false} style={styles.title}>HelpDesk 365</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.termsButton]}
          onPress={() => {
            Linking.openURL('https://www.cubiclogics.com/articles/cubic-logics-terms-of-use');
          }}>
          <Text allowFontScaling={false} style={styles.buttonText}>TERMS OF SERVICE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.privacyButton]}
          onPress={() => {
            Linking.openURL('https://www.cubiclogics.com/articles/website-civic-365-privacy-policy');
          }}>
          <Text allowFontScaling={false} style={styles.buttonText}>PRIVACY</Text>
        </TouchableOpacity>
      </View>
      <Text allowFontScaling={false} style={styles.versionText}>VERSION</Text>
      <Text allowFontScaling={false} style={styles.smallVersionText}>1.0</Text>
      <Text allowFontScaling={false} style={styles.versionText}>{Platform.OS === 'ios' ? 'IOS VERSION' : 'ANDROID VERSION'}</Text>
      <Text allowFontScaling={false} style={styles.smallVersionText}>{Platform.OS === 'ios' ? '12.0 and up' : '5.0 and up'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#026367',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#026367',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#026367',
    fontSize: 14,
  },
  termsButton: {
    marginRight: 5,
  },
  privacyButton: {
    marginLeft: 5,
  },
  versionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  smallVersionText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
});

export default AboutScreen;
