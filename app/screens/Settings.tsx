import ConfirmButton from '../components/ConfirmButton';
import { FormGroup } from '../components/base/FormGroup';
import HeaderButtons from '../components/header/HeaderButtons';
import { useAuth } from '../hooks/useAuth';
import { persistor } from '../store';
import { logout } from '../store/auth';
import { useNavigation } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { Alert, Linking, ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Button, Text, View } from 'react-native-ui-lib';
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
            <Text text80R>
              To delete your account, please email your request to{' '}
              <Text
                onPress={() =>
                  Linking.openURL('mailto:webmaster@mushroomobserver.org')
                }
                underline
              >
                webmaster@mushroomobserver.org
              </Text>
              .
            </Text>
          </FormGroup>
          <Button
            marginT-s4
            label="Submit Feedback"
            onPress={() =>
              Linking.openURL(
                `https://docs.google.com/forms/d/e/1FAIpQLSdqlFlaoUEbL76eFTbJ70cISN0oO3vgz8fZulD4QGb-wCNaZw/viewform?usp=pp_url&entry.1034709423=${
                  auth.user.login_name
                }&entry.1883000247=${DeviceInfo.getVersion()}`,
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
