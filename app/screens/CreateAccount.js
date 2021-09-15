import React from 'react';
import {Button, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import UserContext from '../components/UserContext';
import {Row, Label, Field, Input} from '../components';

const Login = () => {
  const {login} = React.useContext(UserContext);

  const [username, onChangeUsername] = React.useState(null);

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
        <Button title="Login" onPress={() => login(username)} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
