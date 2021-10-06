import React from 'react';
import { Image, SafeAreaView, ScrollView, StatusBar } from 'react-native';

import { Field } from '../components';

const Splash = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Field>
          <Image
            resizeMode="contain"
            style={{ width: '100%', height: 200 }}
            source={require('../logo.png')}
          />
        </Field>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Splash;
