import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import {
  Button,
  Colors,
  Image,
  KeyboardAwareScrollView,
  LoaderScreen,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';

import { loginSuccess } from '../store/auth';
import { useGetApiKeyForUserMutation } from '../store/mushroomObserver';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [username, onChangeUsername] = useState();
  const [password, onChangePassword] = useState();
  const [error, setError] = useState();
  const usernameInput = useRef();
  const passwordInput = useRef();

  const [getApiKeyForUser, { data, isLoading }] = useGetApiKeyForUserMutation();

  useEffect(() => {
    if (!data?.errors && data?.results?.[0]) {
      const {
        user,
        results: [{ key }],
      } = data;
      dispatch(loginSuccess({ login_name: username, id: user, key }));
    } else if (data?.errors) {
      setError('Incorrect username or password');
    }
  }, [data, dispatch, username]);

  return (
    <View flex>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="always"
        getTextInputRefs={() => {
          return [usernameInput, passwordInput];
        }}>
        <View padding-30>
          <Image
            marginB-15
            resizeMode="contain"
            style={{ width: '100%', height: 225 }}
            source={require('../logo.png')}
          />
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
            onSubmitEditing={() =>
              getApiKeyForUser({ login_name: username, password })
            }
            value={password}
            validate="required"
            error={error}
          />
          <Button
            label="Login"
            disabled={!username || !password || isLoading}
            onPress={() => getApiKeyForUser({ login_name: username, password })}
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
      </KeyboardAwareScrollView>
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
