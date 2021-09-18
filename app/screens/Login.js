import React from 'react';
import {Button, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import UserContext from '../components/UserContext';
import {Label, Field, Input} from '../components';

const Login = () => {
  const {login} = React.useContext(UserContext);

  const [username, onChangeUsername] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Field>
          <Label>Username</Label>
          <Input
            placeholder="username"
            autoCapitalize="none"
            textContentType="username"
            autoCompleteType="username"
            onChangeText={onChangeUsername}
            value={username}
          />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input
            placeholder="password"
            autoCapitalize="none"
            textContentType="password"
            autoCompleteType="password"
            secureTextEntry
            onChangeText={onChangePassword}
            value={password}
          />
        </Field>
        <Button
          title="Login"
          disabled={!username || !password}
          onPress={() => login(username, password)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
