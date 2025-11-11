import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import AzureAuth from 'react-native-azure-auth';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setGraphToken, setTokenStoreTime, updateLoginData } from '../../redux/slices/loginSlice';
import { AZURE_APP_CLIENT_ID } from '@env';
import { fetchCurrentUser } from '../../backend/RequestAPI';

const azureAuth = new AzureAuth({
  clientId: AZURE_APP_CLIENT_ID,
});

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const signIn = async () => {
    try {
      setLoading(true);

      const sharepointTokens = await azureAuth.webAuth.authorize({
        scope: 'https://xzm41.sharepoint.com/.default offline_access',
        prompt: 'select_account',
      });

      const graphTokens = await azureAuth.auth.acquireTokenSilent({
        scope: 'openid profile email offline_access User.Read User.ReadBasic.All',
        userId: sharepointTokens.userId,
      });

      console.log(graphTokens.accessToken, "graphTokens.accessToken");
      

      dispatch(setGraphToken(graphTokens.accessToken));
      dispatch(setTokenStoreTime(new Date()));
      dispatch(
        updateLoginData({
          token: sharepointTokens.accessToken,
          email: sharepointTokens.userId,
          name: sharepointTokens.userName,
        })
      );

      const user = await fetchCurrentUser();
      if (user) {
        console.log('login user:', user);
        dispatch(
          updateLoginData({
            token: sharepointTokens.accessToken,
            email: sharepointTokens.userId,
            name: sharepointTokens.userName,
            user: user,
          })
        );
      }

      navigation.replace('Drawer');

      const graphUser = await azureAuth.auth.msGraphRequest({
        token: graphTokens.accessToken,
        path: '/me',
      });
      console.log('Graph User Info:', graphUser);

    } catch (error) {
      console.error('Login Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#026367" />
          <Text style={styles.loaderText}>Signing you in...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={signIn} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Sign In with Microsoft</Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: '#fff',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#026367',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#026367',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
