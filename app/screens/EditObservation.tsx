import { ConfidenceView } from '../components/ConfidenceView';
import NamePicker from '../components/NamePicker';
import { NameView } from '../components/NameView';
import { NamingsView } from '../components/NamingsView';
import { OwnerView } from '../components/OwnerView';
import { VotesView } from '../components/VotesView';
import { selectById, updateObservation } from '../store/observations';
import { ForwardedEditObservationProps } from '../types/navigation';
import { Observation } from '../types/store';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { Button as NativeButton, ScrollView } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

interface EditObservationProps extends PropsFromRedux {
  id: number;
  observation: Observation;
}

const EditObservation = ({ observation }: EditObservationProps) => {
  const navigation = useNavigation();
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <NativeButton title="Save" />,
    });
  }, [navigation, route]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <NameView name={observation.consensus} />
          <NamePicker name={observation.consensus.name} />
          <OwnerView owner={observation.owner} />
          <ConfidenceView confidence={observation.confidence} />
          <NamingsView namings={observation.namings} />
          <Text>Votes:</Text>
          <VotesView votes={observation.votes} />
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (
  state: any,
  ownProps: ForwardedEditObservationProps,
) => ({
  observation: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  updateObservation,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedEditObservation = connector(EditObservation);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedEditObservationProps>()(
  ConnectedEditObservation,
);
