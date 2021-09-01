import React from 'react';
import {Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ActionSheetProvider,
  connectActionSheet,
} from '@expo/react-native-action-sheet';

import Login from './screens/Login';
import ListObservations from './screens/ListObservations';
import CreateObservation from './screens/CreateObservation';
import MapScreen from './screens/MapScreen';
import Settings from './screens/Settings';
import EncryptedStorage from 'react-native-encrypted-storage';

const Stack = createNativeStackNavigator();
const App = () => {
  const [userApiKeyExists, setUserApiKeyExists] = React.useState(false);

  React.useEffect(() => {
    async function retrieveUserApiKey() {
      try {
        const userApiKey = await EncryptedStorage.getItem('USER_API_KEY');
        setUserApiKeyExists(userApiKey !== undefined);
      } catch (error) {
        console.log(error);
      }
    }
    retrieveUserApiKey();
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!userApiKeyExists ? (
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
                headerRight: () => (
                  <Button
                    title="Settings"
                    onPress={() => navigation.navigate('Settings')}
                  />
                ),
              })}
            />
            <Stack.Screen
              name="Create Observation"
              component={CreateObservation}
              options={({navigation}) => ({
                headerRight: () => <Button title="Create" />,
              })}
            />
            <Stack.Screen
              name="Select Location"
              component={MapScreen}
              options={({navigation}) => ({
                headerRight: () => <Button title="Select" />,
              })}
            />
          </>
        )}
        <Stack.Screen name="Settings" component={Settings} />
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
