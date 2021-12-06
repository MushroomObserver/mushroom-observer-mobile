import { loginSuccess } from '../store/auth';
import { usePostUserMutation } from '../store/mushroomObserver';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Colors,
  Keyboard,
  LoaderScreen,
  TextField,
  View,
} from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';

const Register = () => {
  const dispatch = useDispatch();

  const emailInput = useRef<typeof TextField>();
  const [email, setEmail] = useState('');

  const usernameInput = useRef<typeof TextField>();
  const [username, setUsername] = useState('');

  const passwordInput = useRef<typeof TextField>();
  const [password, setPassword] = useState('');

  const [postUser, { data, isLoading }] = usePostUserMutation();

  useEffect(() => {
    if (!data?.errors && data?.results?.[0]) {
      const {
        user,
        results: [
          {
            login_name,
            api_keys: [{ key }],
          },
        ],
      } = data;
      dispatch(loginSuccess({ login_name, id: user, key }));
    }
  }, [data, dispatch, username]);

  return (
    <View flex>
      <ScrollView>
        <View padding-30>
          <TextField
            ref={emailInput}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            title="Email"
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onChangeText={setEmail}
            onSubmitEditing={() => {
              usernameInput.current.focus();
            }}
            blurOnSubmit={false}
            value={email}
            maxLength={80}
            validate={['required', 'email']}
            errorMessage={['This field is required', 'Email is invalid']}
          />
          <TextField
            ref={usernameInput}
            autoCorrect={false}
            autoCapitalize="none"
            title="Username"
            textContentType="username"
            autoCompleteType="username"
            returnKeyType="next"
            enablesReturnKeyAutomatically
            onChangeText={setUsername}
            onSubmitEditing={() => {
              passwordInput.current.focus();
            }}
            blurOnSubmit={false}
            value={username}
            maxLength={80}
            validate="required"
            errorMessage="This field is required"
          />
          <TextField
            ref={passwordInput}
            autoCorrect={false}
            autoCapitalize="none"
            title="Password"
            textContentType="password"
            autoCompleteType="password"
            returnKeyType="done"
            enablesReturnKeyAutomatically
            onChangeText={setPassword}
            onSubmitEditing={() =>
              postUser({ email, login: username, password })
            }
            value={password}
            maxLength={80}
            validate="required"
            errorMessage="This field is required"
          />
          <Button
            label="Register"
            disabled={!email || !username || !password || isLoading}
            onPress={() => postUser({ email, login: username, password })}
          />
        </View>
      </ScrollView>
      {isLoading && (
        <LoaderScreen
          color={Colors.blue30}
          backgroundColor={Colors.grey50}
          message="Loading..."
          overlay
        />
      )}
    </View>
  );
};

export default Register;
