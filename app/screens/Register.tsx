import { FormGroup } from '../components/base/FormGroup';
import { TextField } from '../components/base/TextField';
import { loginSuccess } from '../store/auth';
import { usePostUserMutation } from '../store/mushroomObserver';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Colors, LoaderScreen, Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';

const Register = () => {
  const dispatch = useDispatch();

  const emailInput = useRef<typeof TextField>();
  const [email, setEmail] = useState('');

  const usernameInput = useRef<typeof TextField>();
  const [username, setUsername] = useState('');

  const passwordInput = useRef<typeof TextField>();
  const [password, setPassword] = useState('');

  const confirmPasswordInput = useRef<typeof TextField>();
  const [confirmPassword, setConfirmPassword] = useState('');

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
        <View padding-s4>
          <FormGroup>
            <Text text70M marginB-s2>
              Register
            </Text>
            <TextField
              preset="default"
              ref={emailInput}
              autoFocus
              autoCorrect={false}
              autoCapitalize="none"
              label="Email"
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
              preset="default"
              ref={usernameInput}
              autoCorrect={false}
              autoCapitalize="none"
              label="Username"
              textContentType="username"
              autoCompleteType="username"
              returnKeyType="next"
              enablesReturnKeyAutomatically
              onChangeText={setUsername}
              onSubmitEditing={() => passwordInput.current.focus()}
              blurOnSubmit={false}
              value={username}
              maxLength={80}
              validate="required"
              errorMessage="This field is required"
            />
            <TextField
              preset="default"
              ref={passwordInput}
              autoCorrect={false}
              autoCapitalize="none"
              label="Password"
              textContentType="password"
              autoCompleteType="password"
              returnKeyType="done"
              enablesReturnKeyAutomatically
              onChangeText={setPassword}
              onSubmitEditing={() => confirmPasswordInput.current.focus()}
              value={password}
              maxLength={80}
              validate="required"
              errorMessage="This field is required"
            />
            <TextField
              preset="default"
              ref={confirmPasswordInput}
              autoCorrect={false}
              autoCapitalize="none"
              label="Confirm Password"
              textContentType="password"
              autoCompleteType="password"
              returnKeyType="done"
              enablesReturnKeyAutomatically
              onChangeText={setConfirmPassword}
              onSubmitEditing={() =>
                postUser({ email, login: username, password })
              }
              value={confirmPassword}
              maxLength={80}
              validate="required"
              errorMessage="This field is required"
            />
          </FormGroup>
          <View marginT-s4 row right>
            <Button
              label="Register"
              disabled={
                isLoading ||
                !email ||
                !username ||
                !password ||
                !(password === confirmPassword)
              }
              onPress={() => postUser({ email, login: username, password })}
            />
          </View>
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
