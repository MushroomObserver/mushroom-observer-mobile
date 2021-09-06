import React from 'react';
import {Alert, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ActionSheetProvider,
  connectActionSheet,
} from '@expo/react-native-action-sheet';

import Login from './screens/Login';
import ListObservations from './screens/ListObservations';
import SelectLocation from './screens/CreateObservation/SelectLocation';
import NameAndPhotos from './screens/CreateObservation/NameAndPhotos';
import TimeAndLocation from './screens/CreateObservation/TimeAndLocation';
import IdentificationAndNotes from './screens/CreateObservation/IdentificationAndNotes';
import Settings from './screens/Settings';
import EncryptedStorage from 'react-native-encrypted-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CreateObservationStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Name and Photos" component={NameAndPhotos} />
    <Stack.Screen name="Time and Location" component={TimeAndLocation} />
    <Stack.Screen name="Select Location" component={SelectLocation} />
    <Stack.Screen
      name="Identification and Notes"
      component={IdentificationAndNotes}
    />
  </Stack.Navigator>
);

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
      {!userExists ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Mushroom Observer',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Observations" component={ListObservations} />
          <Tab.Screen
            name="Create Observation"
            component={CreateObservationStack}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={() => ({
              headerRight: () => (
                <Button title="Logout" onPress={() => logoutAlert()} />
              ),
            })}
          />
        </Tab.Navigator>
      )}
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
