import { useAuth } from '../hooks/useAuth';
import { logout } from '../store/auth';
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { Alert, Button, ScrollView } from 'react-native';
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
          <Button
            title="Logout"
            onPress={() =>
              Alert.alert('Logout', 'Are you sure?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => dispatch(logout()),
                },
              ])
            }
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
