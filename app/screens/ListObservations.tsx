import Photo from '../components/Photo';
import { useKey, useUser } from '../hooks/useAuth';
import { addDraftObservation } from '../store/draftObservations';
import { useGetObservationsQuery } from '../store/mushroomObserver';
import { addObservations, selectAll } from '../store/observations';
import { useNavigation } from '@react-navigation/core';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, FloatingButton, Text, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';

const NoObservations = () => (
  <View flex center>
    <Icon name="eye-slash" size={50} color="gray" />
    <Text style={styles.noObservationsLabel}>No Observations</Text>
  </View>
);

const Observation = ({ item }) => {
  const navigation = useNavigation();
  return (
    <Card
      flex
      row
      marginT-10
      marginH-10
      borderRadius={10}
      enableShadow
      onPress={() => navigation.navigate('View Observation', { id: item.id })}
    >
      <View flex flexG padding-7>
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
      {item?.primary_image && (
        <Photo
          id={item.primary_image.id}
          width={90}
          height={90}
          borderTopRightRadius={10}
          borderBottomRightRadius={10}
        />
      )}
    </Card>
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
    <View flex>
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
          onPress: () => {
            const id = nanoid();
            dispatch(addDraftObservation({ id }));
            navigation.navigate('Name and Photos', { id });
          },
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
  noObservationsLabel: {
    margin: 5,
    color: 'gray',
    fontSize: 16,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export default ListObservations;
