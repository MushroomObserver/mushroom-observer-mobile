import NoPhoto from '../../components/NoPhoto';
import ObservationDetails from '../../components/ObservationDetails';
import Photo from '../../components/Photo';
import useDayjs from '../../hooks/useDayjs';
import { selectKey } from '../../store/auth';
import {
  selectById,
  removeObservation as removeObservationAction,
} from '../../store/observations';
import { useNavigation } from '@react-navigation/core';
import { get } from 'lodash';
import React from 'react';
import { Alert } from 'react-native';
import { Card, Colors, Drawer, Text, View } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface ObservationListItemProps extends PropsFromRedux {
  id: string;
}

const ObservationListItem = ({
  apiKey,
  id,
  observation,
  removeObservation,
}: ObservationListItemProps) => {
  const navigation = useNavigation();
  const dayjs = useDayjs();

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
      <Card
        flex
        row
        marginV-5
        marginH-10
        borderRadius={10}
        enableShadow
        onPress={() => navigation.navigate('View Observation', { id })}
      >
        {(get(observation, 'photoIds[0]') && (
          <Photo
            id={observation.photoIds[0]}
            width={90}
            borderTopLeftRadius={10}
            borderBottomLeftRadius={10}
          />
        )) || (
          <NoPhoto
            width={90}
            borderTopLeftRadius={10}
            borderBottomLeftRadius={10}
          />
        )}
        <ObservationDetails
          title={`Observation #${observation.id}`}
          date={observation.date}
          name={`${observation.consensus?.name} ${
            observation.consensus?.author ? observation.consensus.author : ''
          }`}
          location={observation.location_name}
        />
      </Card>
    </Drawer>
  );
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    apiKey: selectKey(state),
    observation: selectById(state, ownProps.id),
  };
};

const mapDispatchToProps = {
  removeObservation: removeObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedObservationListItem = connector(ObservationListItem);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedObservationListItem;
