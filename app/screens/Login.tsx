import { loginSuccess } from '../store/auth';
import { useGetApiKeyForUserMutation } from '../store/mushroomObserver';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Colors,
  Image,
  LoaderScreen,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [username, onChangeUsername] = useState();
  const [password, onChangePassword] = useState();
  const [hasError, setHasError] = useState<string>();
  const usernameInput = useRef<typeof TextField>();
  const passwordInput = useRef<typeof TextField>();

  const [getApiKeyForUser, { status, data, isLoading, error }] =
    useGetApiKeyForUserMutation();
  const submitLogin = () => {
    if (!isLoading) {
      getApiKeyForUser({ login_name: username, password });
    }
  };

  useEffect(() => {
    if (!data?.errors && data?.results?.[0]) {
      const {
        user,
        results: [{ key }],
      } = data;
      dispatch(loginSuccess({ login_name: username, id: user, key }));
    } else if (data?.errors) {
      setHasError('Incorrect username or password');
    }
  }, [data, dispatch, username]);

  console.log(error);
  return (
    <View flex>
      <ScrollView>
        <View padding-30>
          <Image marginB-15 logo />
          <TextField
            ref={usernameInput}
            autoFocus
            autoCorrect={false}
            autoCapitalize="none"
            title="Username"
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
            validate="required"
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
            secureTextEntry
            onChangeText={onChangePassword}
            onSubmitEditing={submitLogin}
            value={password}
            validate="required"
            error={hasError}
          />
          <Button
            label="Login"
            disabled={!username || !password || isLoading}
            onPress={submitLogin}
          />
          <Text marginV-15 center>
            or
          </Text>
          <Button
            outline
            label="Register"
            onPress={() => navigation.navigate('Register')}
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

export default Login;
