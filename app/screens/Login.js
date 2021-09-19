import React from 'react';
import {Button, Image, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import UserContext from '../components/UserContext';
import {Label, Field, Input} from '../components';

const Login = () => {
  const {login} = React.useContext(UserContext);

  const [username, onChangeUsername] = React.useState(null);
  const [password, onChangePassword] = React.useState(null);
  const passwordInput = React.createRef(null);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Field>
          <Image
            resizeMode="contain"
            style={{width: '100%', height: 200}}
            source={require('../logo_MO5.png')}
          />
        </Field>
        <Field>
          <Label>Username</Label>
          <Input
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="username"
            textContentType="username"
            autoCompleteType="username"
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onChangeText={onChangeUsername}
            onSubmitEditing={() => {
              passwordInput.current.focus();
            }}
            blurOnSubmit={false}
            value={username}
          />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input
            ref={passwordInput}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="password"
            textContentType="password"
            autoCompleteType="password"
            returnKeyType="done"
            enablesReturnKeyAutomatically
            secureTextEntry
            onChangeText={onChangePassword}
            onSubmitEditing={() => login(username, password)}
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
