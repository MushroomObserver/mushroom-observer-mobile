import React from 'react';
import {Text, View} from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

import {getObservations} from '../api/musroomObserver';

const ListObservations = ({navigation}) => {
  React.useEffect(() => {
    const loadObservationsForUser = async () => {
      const user = await EncryptedStorage.getItem('USER');
      const userJson = await JSON.parse(user);
      getObservations(userJson);
    };
    loadObservationsForUser();
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>No Observations</Text>
    </View>
  );
};

export default ListObservations;
