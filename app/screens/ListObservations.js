import React, {useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import {useAuth} from '../hooks/useAuth';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useGetObservationsByUserQuery} from '../services/mushroomObserver';
import {useDispatch} from 'react-redux';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

const loadObservations = login_name => ({
  type: 'LOAD_OBSERVATIONS_REQUEST',
  payload: {login_name},
  meta: {
    offline: {
      // the network action to execute:
      effect: {
        url: `${API_URL}/api2/observations?api_key=${API_KEY}&user=${login_name}&detail=high`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
      // action to dispatch when effect succeeds:
      commit: {type: 'LOAD_OBSERVATIONS_COMMIT', meta: {login_name}},
      // action to dispatch if network action fails permanently:
      rollback: {type: 'LOAD_OBSERVATIONS_ROLLBACK', meta: {login_name}},
    },
  },
});
const NoObservations = () => (
  <View style={styles.noObservations}>
    <Icon name="eye-slash" size={50} color="gray" />
    <Text style={styles.noObservationsLabel}>No Observations</Text>
  </View>
);

const Observation = ({item}) => {
  return (
    <TouchableOpacity style={styles.observation}>
      <Image
        width={90}
        height={90}
        resizeMethod="scale"
        source={{
          uri: `https://mushroomobserver.org/images/thumb/${item.primary_image?.id}.jpg`,
        }}
      />
      <View style={styles.observationContent}>
        <Text>Observation #{item.id}</Text>
        <Text>Date: {item.date}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {`${item.consensus?.name} ${item.consensus?.author}`}
        </Text>
        <Text
          style={styles.observationText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {item.location?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ListObservations = () => {
  const auth = useAuth();
  // const {data, isLoading} = useGetObservationsByUserQuery(auth);

  const dispatch = useDispatch();

  useEffect(() => {
    const action = loadObservations('oliviacpu');
    console.log(action);
    dispatch(action);
  }, [dispatch]);
  return (
    <View style={styles.container}>
      <FlatList
        // data={data?.results}
        // refreshing={isLoading}
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
