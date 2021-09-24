import React from 'react';
import {Provider} from 'react-redux';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {UserProvider} from './components/UserContext';
import App from './App';
import {store} from './store';

export default () => {
  return (
    <UserProvider>
      <ActionSheetProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </ActionSheetProvider>
    </UserProvider>
  );
};
