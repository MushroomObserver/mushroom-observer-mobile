/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Login from './Login';
import CreateObservation from './CreateObservation';

const Stack = createNativeStackNavigator();

const Observations = ({navigation}) => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Text>Observations</Text>
    <Button
      title="Create Observation"
      onPress={() => navigation.navigate('Create Observation')}
    />
  </View>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Observations">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Observations"
          component={Observations}
          options={({navigation}) => ({
            headerRight: () => (
              <Button
                title="Login"
                onPress={() => navigation.navigate('Login')}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
