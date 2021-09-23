import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Login from './screens/Login';
import ListObservations from './screens/ListObservations';
import CreateObservation from './screens/CreateObservation';
import Settings from './screens/Settings';
import {useAuth} from './hooks/useAuth';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const auth = useAuth();

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
        </Stack.Navigator>
      ) : (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({size, color}) => {
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
            options={{headerShown: false}}
          />
          <Tab.Screen name="Settings" component={Settings} />
        </Tab.Navigator>
      )}
    </NavigationContainer>
  );
};

export default connectActionSheet(App);
