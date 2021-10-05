import { connectActionSheet } from '@expo/react-native-action-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';

import { useAuth } from './hooks/useAuth';
import CreateObservation from './screens/CreateObservation';
import ListObservations from './screens/ListObservations';
import Login from './screens/Login';
import Register from './screens/Register';
import Settings from './screens/Settings';
import { preloadLocations } from './store/locations';
import { preloadNames } from './store/names';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(preloadNames());
    dispatch(preloadLocations());
  });

  return (
    <NavigationContainer>
      {!auth.user ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Mushroom Observer',
            }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: 'Mushroom Observer',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ size, color }) => {
              switch (route.name) {
                case 'My Observations':
                  return <Icon name="list" size={size} color={color} />;
                case 'Create Observation':
                  return <Icon name="eye" size={size} color={color} />;
                case 'Settings':
                  return <Icon name="cog" size={size} color={color} />;
              }
            },
          })}>
          <Tab.Screen name="My Observations" component={ListObservations} />
          <Tab.Screen
            name="Create Observation"
            component={CreateObservation}
            options={{ headerShown: false }}
          />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default connectActionSheet(App);
