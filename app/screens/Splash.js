import React from 'react';
import { Image, View } from 'react-native-ui-lib';

const Splash = () => {
  return (
    <View flex center>
      <Image
        resizeMode="contain"
        style={{ width: '100%', height: 225 }}
        source={require('../logo.png')}
      />
    </View>
  );
};

export default Splash;
