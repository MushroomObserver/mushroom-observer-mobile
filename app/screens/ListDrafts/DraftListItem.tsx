import {
  selectById,
  removeDraftObservation as removeDraftObservationAction,
} from '../../store/draftObservations';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Colors, Drawer, Text, View } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface DraftListItemProps extends PropsFromRedux {
  id: string;
}

const DraftListItem = ({
  id,
  draftObservation,
  removeDraftObservation,
}: DraftListItemProps) => {
  const navigation = useNavigation();
  return (
    // <Drawer
    //   style={styles.drawer}
    //   useNativeAnimations
    //   rightItems={[
    //     {
    //       text: 'Delete',
    //       background: Colors.red30,
    //       onPress: () => removeDraftObservation(id),
    //     },
    //   ]}
    // >
    <TouchableOpacity
      style={styles.draft}
      activeOpacity={1}
      onPress={() => {
        console.log('! press !');
        navigation.navigate('Name and Photos', { id });
      }}
    >
      <View flex flexG>
        <Text>Draft #{draftObservation.id}</Text>
        <Text>Date: {draftObservation.date}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {draftObservation.name}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {draftObservation.location_name}
        </Text>
      </View>
    </TouchableOpacity>
    // </Drawer>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    borderRadius: 5,
    borderColor: 'whitesmoke',
    borderWidth: 1,
    backgroundColor: 'white',
    margin: 10,
  },
  draft: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 5,
    borderColor: 'whitesmoke',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 7,
  },
});

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    draftObservation: selectById(state, ownProps.id),
  };
};

const mapDispatchToProps = {
  removeDraftObservation: removeDraftObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedDraftListItem = connector(DraftListItem);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedDraftListItem;
