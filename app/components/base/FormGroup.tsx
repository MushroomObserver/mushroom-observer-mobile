import React from 'react';
import { Colors, View, ViewProps } from 'react-native-ui-lib';

export const FormGroup = (props: ViewProps) => {
  return (
    <View
      br20
      style={{ borderColor: Colors.grey40, borderWidth: 1 }}
      padding-s2
      {...props}
    >
      {props.children}
    </View>
  );
};
