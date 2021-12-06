import Photo from '../components/Photo';
import { selectAll } from '../store/draftObservations';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

const NoDrafts = () => (
  <View flex center>
    <Icon name="eye-slash" size={50} color="gray" />
    <Text style={styles.noDraftsLabel}>No Drafts</Text>
  </View>
);

const Draft = ({ item }) => {
  return (
    <TouchableOpacity
      style={styles.draft}
      // onPress={() => navigation.navigate('View Draft', { id: item.id })}
    >
      <View flex flexG>
        <Text>Draft #{item.id}</Text>
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
      <View width={90} height={90}>
        {item?.primary_image && (
          <Photo id={item.primary_image.id} width={90} height={90} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const ListDrafts = () => {
  const drafts = useSelector(selectAll);

  return (
    <View flex>
      <FlatList
        data={drafts}
        ListEmptyComponent={NoDrafts}
        contentContainerStyle={styles.contentContainerStyle}
        renderItem={({ item }) => <Draft item={item} />}
        keyExtractor={item => item?.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  noDraftsLabel: {
    margin: 5,
    color: 'gray',
    fontSize: 16,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
  draft: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    borderColor: 'whitesmoke',
    borderWidth: 1,
    backgroundColor: 'white',
    margin: 10,
    padding: 7,
  },
});

export default ListDrafts;
