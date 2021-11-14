import { useKey, useUser } from '../hooks/useAuth';
import { useGetObservationsQuery } from '../store/mushroomObserver';
import { addObservations, selectAll } from '../store/observations';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Colors,
  FloatingButton,
  Image,
  LoaderScreen,
  Text,
  View,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';

const NoObservations = () => (
  <View style={styles.noObservations}>
    <Icon name="eye-slash" size={50} color="gray" />
    <Text style={styles.noObservationsLabel}>No Observations</Text>
  </View>
);

const Observation = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.observation}
      onPress={() => navigation.navigate('View Observation', { id: item.id })}
    >
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
        <Text numberOfLines={1} ellipsizeMode="tail">
          {item.location_name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const ListObservations = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector(useUser);
  const key = useSelector(useKey);
  const observations = useSelector(selectAll);
  const { data, isLoading } = useGetObservationsQuery({
    api_key: key,
    user: user.login_name,
    detail: 'high',
  });

  useEffect(() => {
    if (data) {
      dispatch(addObservations(data.results));
    }
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={observations}
        ListEmptyComponent={NoObservations}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({ item }) => <Observation item={item} />}
        keyExtractor={item => item?.id}
      />
      <FloatingButton
        visible
        button={{
          label: 'Create Observation',
          onPress: () => navigation.navigate('Name and Photos'),
          iconSource: () => (
            <View marginR-10>
              <Icon name="eye" size={25} color="white" />
            </View>
          ),
        }}
        hideBackgroundOverlay
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
