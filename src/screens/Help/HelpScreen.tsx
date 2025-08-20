import * as React from 'react';
import {Text, View, TouchableOpacity, Linking, StyleSheet} from 'react-native';

function HelpScreen(): JSX.Element {
  const handleEmailUs = () => {
    const email = 'appsupport@hr365us.onmicrosoft.com';
    const subject = 'Support Request - HelpDesk 365 App';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.openURL(mailtoUrl).catch(err =>
      console.error('Failed to open email client:', err),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text allowFontScaling={false} style={styles.infoTextTop}>
          If you need assistance with the HelpDesk 365 app, or have any questions, suggestions, or feedback, we're here to help.
        </Text>

        <Text allowFontScaling={false} style={styles.infoText}>
          Our support team is available to assist you with issues related to login, user access, features, or general inquiries.
        </Text>

        <TouchableOpacity onPress={handleEmailUs}>
          <Text allowFontScaling={false} style={styles.linkText}>
            Contact Support
          </Text>
        </TouchableOpacity>
      </View>

      <Text allowFontScaling={false} style={styles.footerText}>
        Response Time: Within 24–48 business hours
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  content: {
    marginBottom: 1,
  },
  infoTextTop: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    marginTop: 20,
    fontFamily: "Roboto-Regular"
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    fontFamily: "Roboto-Regular"
  },
  linkText: {
    color: '#026367',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '600',
    marginTop: 10,
    fontFamily: "Roboto-Regular"
  },
  footerText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    fontFamily: "Roboto-Regular"
  },
});

export default HelpScreen;
