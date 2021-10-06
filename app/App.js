import { connectActionSheet } from '@expo/react-native-action-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';

import { useIsLogout, useUser } from './hooks/useAuth';
import IdentificationAndNotes from './screens/CreateObservation/IdentificationAndNotes';
import NameAndPhotos from './screens/CreateObservation/NameAndPhotos';
import SelectLocation from './screens/CreateObservation/SelectLocation';
import TimeAndLocation from './screens/CreateObservation/TimeAndLocation';
import EditPhoto from './screens/EditPhoto';
import ListObservations from './screens/ListObservations';
import Login from './screens/Login';
import Register from './screens/Register';
import Settings from './screens/Settings';
import { preloadLocations } from './store/locations';
import { preloadNames } from './store/names';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ size, color }) => {
        switch (route.name) {
          case 'My Observations':
            return <Icon name="list" size={size} color={color} />;
          case 'Settings':
            return <Icon name="cog" size={size} color={color} />;
        }
      },
    })}>
    <Tab.Screen name="My Observations" component={ListObservations} />
    <Tab.Screen name="Settings" component={Settings} />
  </Tab.Navigator>
);

const Home = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="Name and Photos" component={NameAndPhotos} />
    <Stack.Screen name="Time and Location" component={TimeAndLocation} />
    <Stack.Screen name="Select Location" component={SelectLocation} />
    <Stack.Screen
      name="Identification and Notes"
      component={IdentificationAndNotes}
    />
    <Stack.Screen name="Edit Photo" component={EditPhoto} />
  </Stack.Navigator>
);

const LoginOrRegister = () => {
  const isLogout = useIsLogout();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
        animationTypeForReplace={isLogout ? 'pop' : 'push'}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          title: 'Register',
        }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  const user = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(preloadNames());
    dispatch(preloadLocations());
  });

  return (
    <NavigationContainer>
      {!user ? <LoginOrRegister /> : <Home />}
    </NavigationContainer>
  );
};

export default connectActionSheet(App);
