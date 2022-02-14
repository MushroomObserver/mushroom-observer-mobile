import ConfirmButton from '../components/ConfirmButton';
import HeaderButtons from '../components/header/HeaderButtons';
import { useAuth } from '../hooks/useAuth';
import { persistor } from '../store';
import { logout } from '../store/auth';
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { Alert, ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Text, View } from 'react-native-ui-lib';
import { Item } from 'react-navigation-header-buttons';
import { useDispatch } from 'react-redux';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useAuth();

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

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-30>
          <Text marginB-15>Logged in as {auth.user.login_name}</Text>
          <Text marginB-15>
            Current API key:{' '}
            {`********************${auth.key.substring(
              auth.key.length - 4,
              auth.key.length,
            )}`}
          </Text>
          <Text marginB-15>Version: {DeviceInfo.getVersion()}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
