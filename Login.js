/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import Config from 'react-native-config';

import styles from './styles';

const Row = props => <View style={styles.row}>{props.children}</View>;
const Field = props => <View style={styles.field}>{props.children}</View>;
const Label = props => (
  <Text style={styles.label} {...props}>
    {props.children}
  </Text>
);
const Input = props => <TextInput style={styles.input} {...props} />;

const Login = () => {
  const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
  const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

  const [username, onChangeUsername] = React.useState(null);

  const login = async () => {
    try {
      const apiKeyResponse = await fetch(
        `${API_URL}/api2/api_keys?api_key=${API_KEY}&for_user=${username}&app=mobile-test&detail=high`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const apiKeyJson = await apiKeyResponse.json();
      console.log(apiKeyJson);
      let {
        user,
        results: [{key}],
      } = apiKeyJson;
      console.log(user, key);
      const userResponse = await fetch(
        `${AUTH_URL}/api2/user?api_key=${APP_API_KEY}&id=${user}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      );
      const userJson = await userResponse.json();
      console.log(userJson);
    } catch (error) {
      console.error(error);
    } finally {
      console.log('done');
    }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Row>
          <Field>
            <Label>Username</Label>
            <Input
              placeholder="username"
              style={styles.input}
              onChangeText={onChangeUsername}
              value={username}
            />
          </Field>
        </Row>
        <Button title="Login" onPress={() => login()} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
