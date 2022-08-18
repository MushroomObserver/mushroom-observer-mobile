import ListItemLayout from '../../components/layouts/ListItemLayout';
import getImageUri from '../../hooks/useGetImageUri';
import { selectKey } from '../../store/auth';
import { selectById as selectImageById } from '../../store/images';
import {
  selectById as selectObservationById,
  removeObservation as removeObservationAction,
} from '../../store/observations';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Alert } from 'react-native';
import { Colors, Drawer } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface ObservationListItemProps extends PropsFromRedux {
  id: string;
}

const ObservationListItem = ({
  id,
  observation,
  photo,
  removeObservation,
}: ObservationListItemProps) => {
  const navigation = useNavigation();

  console.log(photo);
  return (
    <Drawer
      useNativeAnimations
      rightItems={[
        {
          text: 'Delete',
          background: Colors.red30,
          onPress: () =>
            Alert.alert(
              'Delete Observation',
              'Do you want to delete this observation? (The uploaded observation will remain.)',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => {
                    removeObservation(id);
                  },
                },
              ],
            ),
        },
      ]}
    >
      <ListItemLayout
        uri={getImageUri(photo?.files[0])}
        title={`Observation #${observation.id}`}
        date={observation.date}
        name={`${observation.consensus?.name} ${
          observation.consensus?.author ? observation.consensus.author : ''
        }`}
        location={observation.location_name}
        coordinates={observation.coordinates}
        onPress={() => navigation.navigate('View Observation', { id })}
      />
    </Drawer>
  );
};

const mapStateToProps = (state: any, ownProps: any) => {
  const observation = selectObservationById(state, ownProps.id);
  let photo;
  if (observation?.photoIds) {
    photo = selectImageById(state, observation.photoIds[0]);
  }
  return {
    observation,
    photo,
  };
};

const mapDispatchToProps = {
  removeObservation: removeObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedObservationListItem = connector(ObservationListItem);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedObservationListItem;
