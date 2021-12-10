import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';

const DraftListEmptyView = () => (
  <View flex center>
    <Icon name="eye-slash" size={50} color="gray" />
    <Text style={styles.noDraftsLabel}>No Drafts</Text>
  </View>
);

const styles = StyleSheet.create({
  noDraftsLabel: {
    margin: 5,
    color: 'gray',
    fontSize: 16,
  },
});

export default DraftListEmptyView;
