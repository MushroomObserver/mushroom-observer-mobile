import React from 'react';
import {Alert, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import Login from './screens/Login';
import ListObservations from './screens/ListObservations';
import CreateObservation from './screens/CreateObservation';
import Settings from './screens/Settings';

import UserContext from './components/UserContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const {user, logout} = React.useContext(UserContext);

  return (
    <NavigationContainer>
      {!user ? (
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
            component={CreateObservation}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={() => ({
              headerRight: () => (
                <Button
                  title="Logout"
                  onPress={() =>
                    Alert.alert('Logout', 'Are you sure?', [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: logout,
                      },
                    ])
                  }
                />
              ),
            })}
          />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default connectActionSheet(App);
