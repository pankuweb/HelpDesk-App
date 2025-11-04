import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import { Platform } from 'react-native';
import NavigationWrapper from './src/routes/root-navigation';
import InitTenant from './src/components/InitTenant';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AzureAuth from 'react-native-azure-auth';
import { setGraphToken, updateLoginData } from './src/redux/slices/loginSlice';
import { useSelector } from 'react-redux';
import { fetchCurrentUser } from './src/backend/RequestAPI';
import { AZURE_APP_CLIENT_ID } from '@env';

const queryClient = new QueryClient();

const AppWithAuth = () => {
  return (
    <>
      <InitTenant />
      <NavigationWrapper />
    </>
  );
};

const App: React.FC = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        {Platform.OS === 'ios' ? (
          <SafeAreaProvider>
            <AppWithAuth />
          </SafeAreaProvider>
        ) : (
          <SafeAreaView style={{ flex: 1 }}>
            <AppWithAuth />
          </SafeAreaView>
        )}
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);

export default App;
