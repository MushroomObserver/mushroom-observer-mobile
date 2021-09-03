import React from 'react';
import {Button, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Row, Label, Field, Input} from '../components';

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
      let {
        user,
        results: [{key}],
      } = apiKeyJson;

      await EncryptedStorage.setItem(
        'USER',
        JSON.stringify({name: username, id: user, apiKey: key}),
      );
    } catch (error) {
      console.error(error);
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
