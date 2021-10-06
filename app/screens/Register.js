import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import {
  Button,
  Colors,
  KeyboardAwareScrollView,
  LoaderScreen,
  TextField,
  View,
} from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';

import { loginSuccess } from '../store/auth';
import { usePostUserMutation } from '../store/mushroomObserver';
const Register = () => {
  const dispatch = useDispatch();

  const emailInput = useRef();
  const [email, setEmail] = useState();

  const usernameInput = useRef();
  const [username, setUsername] = useState();

  const passwordInput = useRef();
  const [password, setPassword] = useState();

  const [error, setError] = useState();

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
    } else if (data?.errors) {
      setError('Incorrect username or password');
    }
  }, [data, dispatch, username]);

  return (
    <SafeAreaView>
      <StatusBar />
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        getTextInputRefs={() => {
          return [emailInput, usernameInput, passwordInput];
        }}>
        <View padding-30>
          <TextField
            ref={emailInput}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            title="Email"
            textContentType="email"
            autoCompleteType="email"
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
            onSubmitEditing={() => postUser({ email, username, password })}
            value={password}
            maxLength={80}
            validate="required"
            errorMessage="This field is required"
          />
          <Button
            label="Register"
            disabled={!email || !username || !password || isLoading}
            onPress={() => postUser({ email, username, password })}
          />
        </View>
      </KeyboardAwareScrollView>
      {isLoading && (
        <LoaderScreen
          color={Colors.blue30}
          backgroundColor={Colors.grey50}
          message="Loading..."
          overlay
        />
      )}
    </SafeAreaView>
  );
};

export default Register;
