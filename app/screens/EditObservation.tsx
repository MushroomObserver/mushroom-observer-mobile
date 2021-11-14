import { selectById, updateObservation } from '../store/observations';
import { ForwardedEditObservationProps } from '../types/navigation';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useLayoutEffect } from 'react';
import { Button as NativeButton, ScrollView } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

interface EditObservationProps extends PropsFromRedux {
  id: number;
  observation: object;
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
          <Text>{observation?.consensus?.name}</Text>
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
