import React from 'react';
import {ActionSheetProvider} from '@expo/react-native-action-sheet';
import {UserProvider} from './components/UserContext';
import {DatabaseProvider} from './components/DatabaseContext';
import App from './App';

export default () => {
  return (
    <UserProvider>
      <DatabaseProvider>
        <ActionSheetProvider>
          <App />
        </ActionSheetProvider>
      </DatabaseProvider>
    </UserProvider>
  );
};
