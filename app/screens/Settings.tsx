import ConfirmButton from '../components/ConfirmButton';
import { FormGroup } from '../components/base/FormGroup';
import HeaderButtons from '../components/header/HeaderButtons';
import { useAuth } from '../hooks/useAuth';
import { persistor } from '../store';
import { logout } from '../store/auth';
import { useDeleteUserMutation } from '../store/mushroomObserver';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Linking, ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { color } from 'react-native-reanimated';
import {
  Button,
  Colors,
  LoaderScreen,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import { Item } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useAuth();

  const [deleteUser, deleteUserResult] = useDeleteUserMutation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (deleteUserResult.isSuccess) {
      persistor.purge();
      dispatch(logout());
    }
  }, [deleteUserResult]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons>
          <Item
            title={'Logout'}
            onPress={() =>
              Alert.alert('Logout', 'Are you sure?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    persistor.purge();
                    dispatch(logout());
                  },
                },
              ])
            }
          />
        </HeaderButtons>
      ),
    });
  });

  if (deleteUserResult.isLoading) {
    return (
      <LoaderScreen
        color={Colors.blue30}
        backgroundColor={Colors.grey50}
        message="Loading..."
        overlay
      />
    );
  }

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-s4>
          <FormGroup>
            <Text text100M grey10>
              Version
            </Text>
            <Text text80R>{DeviceInfo.getVersion()}</Text>
            <Text text100M grey10>
              Current User
            </Text>
            <Text text80R>{auth.user.login_name}</Text>
            <Text text100M grey10>
              API Key
            </Text>
            <Text text80R>
              {`********************${auth.key.substring(
                auth.key.length - 4,
                auth.key.length,
              )}`}
            </Text>
          </FormGroup>
          <FormGroup marginT-s4>
            <Text text100M grey10>
              Delete Account
            </Text>
            <Text text80R marginB-s4>
              If you would like to delete your account, type your username below
              to confirm.
            </Text>
            <TextField
              preset="default"
              autoCorrect={false}
              autoCapitalize="none"
              label="Username"
              textContentType="username"
              onChangeText={setUsername}
              value={username}
              validate={() => deleteUserResult.isError}
              validationMessage={
                'There was a problem deleting your account, please try again later.'
              }
            />
            <Button
              disabled={username !== auth.user.login_name}
              backgroundColor={Colors.red10}
              label="Delete Account"
              onPress={() => {
                deleteUser({ key: auth.key });
              }}
            />
          </FormGroup>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
