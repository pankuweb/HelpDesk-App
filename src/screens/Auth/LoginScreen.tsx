import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import AzureAuth from 'react-native-azure-auth';

const azureAuth = new AzureAuth({
  clientId: '5a3c0241-bf96-4577-a43e-0e24148e2d49',
});

const LoginScreen = () => {
  const signIn = async () => {
    try {
      let tokens = await azureAuth.webAuth.authorize({
        scope: 'openid profile User.Read',
      });
      console.log('Tokens:', tokens);

      let info = await azureAuth.auth.msGraphRequest({
        token: tokens.accessToken,
        path: '/me',
      });
      console.log('User Info:', info);
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Sign In with Azure" onPress={signIn} color="#026367" />
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: '600',
  },
});