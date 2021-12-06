import ConfirmButton from '../components/ConfirmButton';
import { useAuth } from '../hooks/useAuth';
import { persistor } from '../store';
import { logout } from '../store/auth';
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';

const Settings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auth = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View marginR-15>
          <ConfirmButton
            buttonTitle="Logout"
            alertTitle="Logout"
            alertMessage="Are you sure?"
            onConfirm={() => {
              persistor.purge();
              dispatch(logout());
            }}
          />
        </View>
      ),
    });
  });

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-30>
          <Text marginB-15>Logged in as {auth.user.login_name}</Text>
          <Text>
            Current API key:{' '}
            {`********************${auth.key.substring(
              auth.key.length - 4,
              auth.key.length,
            )}`}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
