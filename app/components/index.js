import React from 'react';
import {Text, TextInput, View} from 'react-native';

import styles from '../styles';

export const Row = props => <View style={styles.row}>{props.children}</View>;
export const Field = props => (
  <View style={styles.field}>{props.children}</View>
);
export const Label = props => (
  <Text style={[styles.label]} {...props}>
    {props.children}
  </Text>
);
export const Sublabel = props => (
  <Text style={styles.sublabel} {...props}>
    {props.children}
  </Text>
);

export const Input = props => <TextInput style={styles.input} {...props} />;

export default {
  Row,
  Field,
  Label,
  Input,
};
