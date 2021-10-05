import React, {useState, createRef, useEffect} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';

import {useDispatch} from 'react-redux';
import {login, loginSuccess} from '../store/auth';
import {useGetApiKeyForUserMutation} from '../store/mushroomObserver';
import {Label, Field} from '../components';
import styles from '../styles';

class Input extends React.Component {
  textInput;

  focus() {
    this.textInput.focus();
  }

  render() {
    return (
      <TextInput
        ref={r => (this.textInput = r)}
        style={styles.input}
        {...this.props}
      />
    );
  }
}

const Login = () => {
  const dispatch = useDispatch();
  const [username, onChangeUsername] = useState(null);
  const [password, onChangePassword] = useState(null);
  const passwordInput = createRef(null);

  const [getApiKeyForUser, {data, isLoading}] = useGetApiKeyForUserMutation();

  useEffect(() => {
    if (!data?.error && data?.results?.[0]) {
      const {
        user,
        results: [{key}],
      } = data;
      dispatch(loginSuccess({login_name: username, id: user, key}));
    }
  });

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
            onSubmitEditing={() =>
              getApiKeyForUser({login_name: username, password})
            }
            value={password}
          />
        </Field>
        <Button
          title="Login"
          disabled={!username || !password || isLoading}
          onPress={() => getApiKeyForUser({login_name: username, password})}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
