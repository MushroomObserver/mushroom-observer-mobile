import { loginSuccess as loginSuccessAction } from '../store/auth';
import { useGetApiKeyForUserMutation } from '../store/mushroomObserver';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import Config from 'react-native-config';
import {
  Button,
  Colors,
  Image,
  LoaderScreen,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

const Login = ({ loginSuccess }: PropsFromRedux) => {
  const navigation = useNavigation();
  const [username, onChangeUsername] = useState('');
  const [password, onChangePassword] = useState('');
  const [hasError, setHasError] = useState<string | undefined>();
  const usernameInput = useRef<typeof TextField>();
  const passwordInput = useRef<typeof TextField>();

  const [getApiKeyForUser, response] = useGetApiKeyForUserMutation();

  const submitLogin = () => {
    if (!response.isLoading) {
      getApiKeyForUser({
        api_key: Config.MUSHROOM_OBSERVER_API_KEY,
        for_user: username,
        password,
        app: 'Mushroom Observer Mobile',
        detail: 'high',
      });
    }
  };

  useEffect(() => {
    console.log(response);
    if (response.data && response.data?.results) {
      const {
        user,
        results: [{ key }],
      } = response.data;
      loginSuccess({ login_name: username, id: user, key });
    } else if (response.error) {
      setHasError('Incorrect username or password');
    }
  }, [response, username]);

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
            disabled={!username || !password || response.isLoading}
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
      {response.isLoading && (
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

const mapDispatchToProps = {
  loginSuccess: loginSuccessAction,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Login);
