import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import { persistor, store } from './store';

export default () => {
  return (
    <ActionSheetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </ActionSheetProvider>
  );
};
