import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';

import {useUser} from '../hooks/useAuth';
import {loadObservations, selectAll} from '../store/observations';

const NoObservations = () => (
  <View style={styles.noObservations}>
    <Icon name="eye-slash" size={50} color="gray" />
    <Text style={styles.noObservationsLabel}>No Observations</Text>
  </View>
);

const Observation = ({item}) => {
  return (
    <TouchableOpacity style={styles.observation}>
      {item.primary_image && (
        <Image
          width={90}
          height={90}
          resizeMethod="scale"
          source={{
            uri: `https://mushroomobserver.org/images/thumb/${item.primary_image.id}.jpg`,
          }}
        />
      )}
      <View style={styles.observationContent}>
        <Text>Observation #{item.id}</Text>
        <Text>Date: {item.date}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {`${item.consensus?.name} ${
            item.consensus?.author ? item.consensus.author : ''
          }`}
        </Text>
        <Text
          style={styles.observationText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.location_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ListObservations = () => {
  const dispatch = useDispatch();
  const user = useSelector(useUser);
  const observations = useSelector(selectAll);

  useEffect(() => {
    // dispatch(loadObservations(user.login_name));
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <FlatList
        data={observations}
        ListEmptyComponent={NoObservations}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({item}) => <Observation item={item} />}
        keyExtractor={item => item?.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noObservations: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noObservationsLabel: {
    margin: 5,
    color: 'gray',
    fontSize: 16,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  observation: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    borderColor: 'whitesmoke',
    borderWidth: 1,
    backgroundColor: 'white',
    margin: 10,
    padding: 7,
  },
  observationContent: {
    flex: 1,
    flexGrow: 1,
    marginHorizontal: 7,
    justifyContent: 'space-between',
  },
});

export default ListObservations;
