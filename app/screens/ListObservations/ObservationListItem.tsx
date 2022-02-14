import Photo from '../../components/Photo';
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
        <View flex flexG padding-7>
          <Text>Observation #{observation.id}</Text>
          <Text>Date: {observation.date}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {`${observation.consensus?.name} ${
              observation.consensus?.author ? observation.consensus.author : ''
            }`}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {observation.location_name}
          </Text>
        </View>
        {get(observation, 'photoIds[0]') && (
          <Photo
            id={observation.photoIds[0]}
            width={90}
            height={90}
            borderTopRightRadius={10}
            borderBottomRightRadius={10}
          />
        )}
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
