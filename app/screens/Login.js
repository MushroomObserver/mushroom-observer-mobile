import React, {useState, useEffect, createRef} from 'react';
import {Button, Image, SafeAreaView, ScrollView, StatusBar} from 'react-native';
import {useDispatch} from 'react-redux';
import {setCredentials} from '../services/auth';
import {
  useGetApiKeyForUserMutation,
  useGetUserByIdQuery,
} from '../services/mushroomObserver';
import {Label, Field, Input} from '../components';

const Login = () => {
  const dispatch = useDispatch();

  const [
    login,
    {isLoading: isLoggingIn, data: loginResponse, isSuccess: isLoginSuccess},
  ] = useGetApiKeyForUserMutation();

  const [username, onChangeUsername] = useState(null);
  const [password, onChangePassword] = useState(null);
  const passwordInput = createRef(null);

  const {data: userResponse, isSuccess: isUserLoaded} = useGetUserByIdQuery(
    loginResponse?.user,
    {
      skip: !isLoginSuccess,
    },
  );

  const submitLogin = () => login({username, password});

  useEffect(() => {
    if (isLoginSuccess && isUserLoaded) {
      dispatch(
        setCredentials({
          user: userResponse.results[0],
          key: loginResponse.results[0].key,
        }),
      );
    }
  }, [
    dispatch,
    isLoginSuccess,
    isUserLoaded,
    loginResponse?.results,
    userResponse?.results,
  ]);
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
            onSubmitEditing={submitLogin}
            value={password}
          />
        </Field>
        <Button
          title="Login"
          disabled={!username || !password || isLoggingIn}
          onPress={submitLogin}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
