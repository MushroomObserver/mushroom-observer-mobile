import React from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';

import {Row, Field, Label, Sublabel} from '../components';
import UserContext from '../components/UserContext';

const Settings = () => {
  const {user} = React.useContext(UserContext);

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
