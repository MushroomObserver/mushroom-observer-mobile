import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import {Row, Field, Label, Sublabel} from '../components';

const Settings = () => {
  const [user, setUser] = React.useState({
    name: '',
    id: 0,
    apiKey: '',
  });

  React.useLayoutEffect(() => {
    async function retrieveUserAndApiKey() {
      try {
        const storedUser = await EncryptedStorage.getItem('USER');
        if (storedUser !== undefined) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        // There was an error on the native side
      }
    }
    retrieveUserAndApiKey();
  });

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Field>
          <Row>
            <Label>Logged in as</Label>
            <Sublabel>{user?.name}</Sublabel>
          </Row>
        </Field>
        <Field>
          <Row>
            <Label>Current API key</Label>
            <Sublabel>{`********************${user?.apiKey.substring(
              user?.apiKey.length - 4,
              user?.apiKey.length,
            )}`}</Sublabel>
          </Row>
        </Field>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
