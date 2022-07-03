import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React from 'react';
import { Image, View } from 'react-native-ui-lib';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-native-gesture-handler';
import App from './App';
import { persistor, store } from './store';
import loadAssets from './styles/assets';
import loadFoundation from './styles/foundation';
import loadTheme from './styles/theme';
import { StatusBar } from 'react-native';

loadAssets();
loadFoundation();
loadTheme();

export default () => {
  return (
    <ActionSheetProvider>
      <Provider store={store}>
        <PersistGate
          loading={
            <View flex center>
              <Image logo />
            </View>
          }
          persistor={persistor}>
          <StatusBar barStyle="dark-content" />
          <App />
        </PersistGate>
    </Provider>
    </ActionSheetProvider>
  );
};
