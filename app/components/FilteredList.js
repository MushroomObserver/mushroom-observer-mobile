import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {filter, slice} from 'lodash-es';

const FilteredList = ({data, query, property, ...props}) => {
  const filteredData = filter(data, i => i[property].startsWith(query));
  const first100Items = slice(filteredData, 0, 100);
  return (
    <View style={styles.container}>
      <FlatList
        data={first100Items}
        contentContainerStyle={styles.contentContainerStyle}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
  },
});

export default FilteredList;
