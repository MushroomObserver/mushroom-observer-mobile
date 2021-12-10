import Photo from '../../components/Photo';
import {
  selectById,
  removeDraftObservation as removeDraftObservationAction,
} from '../../store/draftObservations';
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
  console.log(id, draftObservation);
  return (
    <Drawer
      style={styles.drawer}
      useNativeAnimations
      rightItems={[
        {
          text: 'Delete',
          background: Colors.red30,
          testID: 'right_item_delete',
          onPress: () => removeDraftObservation(id),
        },
      ]}
    >
      <TouchableOpacity
        style={styles.draft}
        // onPress={() => navigation.navigate('View Draft', { id })}
      >
        <View flex flexG>
          <Text>Draft #{draftObservation?.id}</Text>
          <Text>Date: {draftObservation.date}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {`${draftObservation.consensus?.name} ${
              draftObservation.consensus?.author
                ? draftObservation.consensus.author
                : ''
            }`}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {draftObservation.location_name}
          </Text>
        </View>
        <View width={90} height={90}>
          {draftObservation?.primary_image && (
            <Photo
              id={draftObservation.primary_image.id}
              width={90}
              height={90}
            />
          )}
        </View>
      </TouchableOpacity>
    </Drawer>
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
  console.log(ownProps);
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
