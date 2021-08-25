import React from 'react';
import {Button, Text, View} from 'react-native';

const ListObservations = ({navigation}) => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Text>Observations</Text>
    <Button
      title="Create Observation"
      onPress={() => navigation.navigate('Create Observation')}
    />
  </View>
);

export default ListObservations;
