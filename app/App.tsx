import { useIsLogout, useUser } from './hooks/useAuth';
import IdentificationAndNotes from './screens/CreateObservation/IdentificationAndNotes';
import NameAndPhotos from './screens/CreateObservation/NameAndPhotos';
import SelectLocation from './screens/CreateObservation/SelectLocation';
import TimeAndLocation from './screens/CreateObservation/TimeAndLocation';
import EditObservation from './screens/EditObservation';
import EditPhoto from './screens/EditPhoto';
import ListObservations from './screens/ListObservations';
import Login from './screens/Login';
import Register from './screens/Register';
import Settings from './screens/Settings';
import ViewObservation from './screens/ViewObservation';
import { preloadLocations } from './store/locations';
import { preloadNames } from './store/names';
import { LoginStackParamList } from './types/navigation';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useReduxDevToolsExtension } from '@react-navigation/devtools';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';

const { Navigator: LoginStackNavigator, Screen: LoginStackScreen } =
  createNativeStackNavigator<LoginStackParamList>();
const {
  Navigator: HomeStackNavigator,
  Group: HomeStackGroup,
  Screen: HomeStackScreen,
} = createNativeStackNavigator();
const { Navigator: HomeTabsNavigator, Screen: HomeTabsScreen } =
  createBottomTabNavigator();

const LoginStack = () => {
  const isLogout = useIsLogout();
  return (
    <LoginStackNavigator>
      <LoginStackScreen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          animationTypeForReplace: isLogout ? 'pop' : 'push',
        }}
      />
      <LoginStackScreen
        name="Register"
        component={Register}
        options={{
          title: 'Register',
        }}
      />
    </LoginStackNavigator>
  );
};

const HomeTabs = () => (
  <HomeTabsNavigator>
    <HomeTabsScreen
      name="My Observations"
      component={ListObservations}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="list" size={size} color={color} />
        ),
      }}
    />
    <HomeTabsScreen
      name="Settings"
      component={Settings}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="cog" size={size} color={color} />
        ),
      }}
    />
  </HomeTabsNavigator>
);

const HomeStack = () => (
  <HomeStackNavigator>
    <HomeStackScreen
      name="Home"
      component={HomeTabs}
      options={{ headerShown: false }}
    />
    <HomeStackGroup screenOptions={{ presentation: 'card' }}>
      <HomeStackScreen name="Name and Photos" component={NameAndPhotos} />
      <HomeStackScreen name="Time and Location" component={TimeAndLocation} />
      <HomeStackScreen name="Select Location" component={SelectLocation} />
      <HomeStackScreen
        name="Identification and Notes"
        component={IdentificationAndNotes}
      />
    </HomeStackGroup>
    <HomeStackScreen name="View Observation" component={ViewObservation} />
    <HomeStackScreen name="Edit Observation" component={EditObservation} />
    <HomeStackScreen name="Edit Photo" component={EditPhoto} />
  </HomeStackNavigator>
);

const App = () => {
  const user = useUser();
  const dispatch = useDispatch();
  const navigationRef = useNavigationContainerRef();

  useReduxDevToolsExtension(navigationRef);

  useEffect(() => {
    dispatch(preloadNames(undefined));
    dispatch(preloadLocations(undefined));
  });

  return (
    <NavigationContainer ref={navigationRef}>
      {!user ? <LoginStack /> : <HomeStack />}
    </NavigationContainer>
  );
};

export default connectActionSheet(App);
