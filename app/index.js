import React from 'react';
import {Alert, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ActionSheetProvider,
  connectActionSheet,
} from '@expo/react-native-action-sheet';

import Login from './screens/Login';
import ListObservations from './screens/ListObservations';
import CreateObservation from './screens/CreateObservation';
import SelectLocation from './screens/SelectLocation';
import Settings from './screens/Settings';
import EncryptedStorage from 'react-native-encrypted-storage';

const Stack = createNativeStackNavigator();
const App = () => {
  const [userExists, setUserExists] = React.useState(false);

  React.useLayoutEffect(() => {
    async function retrieveUserApiKey() {
      try {
        const user = await EncryptedStorage.getItem('USER');
        setUserExists(user !== undefined);
      } catch (error) {
        console.log(error);
      }
    }
    retrieveUserApiKey();
  });

  const logoutAlert = () =>
    Alert.alert('Logout', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: async () => {
          try {
            await EncryptedStorage.clear();
            setUserExists(false);
            // Congrats! You've just cleared the device storage!
          } catch (error) {
            // There was an error on the native side
          }
        },
      },
    ]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!userExists ? (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Mushroom Observer',
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Observations"
              component={ListObservations}
              options={({navigation}) => ({
                headerLeft: () => (
                  <Button
                    title="Settings"
                    onPress={() => navigation.navigate('Settings')}
                  />
                ),
                headerRight: () => (
                  <Button
                    title="Create"
                    onPress={() => navigation.navigate('Create Observation')}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Create Observation"
              component={CreateObservation}
            />
            <Stack.Screen name="Select Location" component={SelectLocation} />
          </>
        )}
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={() => ({
            headerRight: () => (
              <Button title="Logout" onPress={() => logoutAlert()} />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ConnectedApp = connectActionSheet(App);

const AppContainer = () => {
  return (
    <ActionSheetProvider>
      <ConnectedApp />
    </ActionSheetProvider>
  );
};

export default AppContainer;
