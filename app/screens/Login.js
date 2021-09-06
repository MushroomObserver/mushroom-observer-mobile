import React from 'react';
import {Button, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Row, Label, Field, Input} from '../components';

import {login} from '../api/musroomObserver';

const Login = () => {
  const [username, onChangeUsername] = React.useState(null);

  const submitLogin = async () => {
    try {
      const user = await login(username);
      await EncryptedStorage.setItem('USER', JSON.stringify(user));
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
        <Button title="Login" onPress={submitLogin} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
