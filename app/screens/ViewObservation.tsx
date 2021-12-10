import Photo from '../components/Photo';
import {
  removeObservation as removeObservationAction,
  selectById,
} from '../store/observations';
import { ForwardedViewObservationProps } from '../types/navigation';
import { Observation } from '../types/store';
import { useNavigation, useRoute } from '@react-navigation/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { concat } from 'lodash';
import React, { useLayoutEffect } from 'react';
import { Button as NativeButton, Dimensions, ScrollView } from 'react-native';
import { Carousel, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect } from 'react-redux';

dayjs.extend(LocalizedFormat);

interface ViewObservationProps {
  id: number;
  observation: Observation;
}

const { width: screenWidth } = Dimensions.get('window');

const ViewObservation = ({
  id,
  observation,
}: ForwardedViewObservationProps) => {
  const navigation = useNavigation();
  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Observation #${id}`,
      headerRight: () => (
        <>
          <NativeButton
            title="Edit"
            onPress={() => navigation.navigate('Edit Observation', { id })}
          />
        </>
      ),
    });
  }, [navigation, route]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {observation.primary_image && (
          <Carousel
            showCounter
            horizontal
            containerMarginHorizontal={10}
            containerPaddingVertical={10}
            allowAccessibleLayout
            pageControlPosition={Carousel.pageControlPositions.OVER}
          >
            {concat(observation.primary_image, observation.images).map(
              (image: object) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('View Photo', {
                      id: image.id,
                    })
                  }
                >
                  <Photo
                    id={image.id}
                    width={screenWidth - 20}
                    height={220}
                    borderRadius={10}
                  />
                </TouchableOpacity>
              ),
            )}
          </Carousel>
        )}
        <View flex paddingH-15>
          <Text text70H>
            Date: <Text text70>{dayjs(observation.date).format('ll')}</Text>
          </Text>
          <Text text70H>
            Owner: <Text text70>{observation.owner.login_name}</Text>
          </Text>
          <Text text70H>
            Consensus: <Text text70>{observation.consensus.name}</Text>
          </Text>
          <Text text70H>
            Confidence: <Text text70>{observation.confidence}</Text>
          </Text>
          <Text text70H>
            Location name: <Text text70>{observation.location_name}</Text>
          </Text>
          <Text text70H>
            Is collection location?:{' '}
            <Text text70>
              {observation.is_collection_location ? 'Yes' : 'No'}
            </Text>
          </Text>
          <Text text70H>
            GPS Hidden:{' '}
            <Text text70>{observation.gps_hidden ? 'Yes' : 'No'}</Text>{' '}
          </Text>
          <Text text70H>
            Specimen Available:{' '}
            <Text text70>{observation.specimen_available ? 'Yes' : 'No'}</Text>{' '}
          </Text>
          <Text text70H>
            Created at:{' '}
            <Text text70>{dayjs(observation.created_at).format('lll')}</Text>{' '}
          </Text>
          <Text text70H>
            Updated at:{' '}
            <Text text70>{dayjs(observation.updated_at).format('lll')}</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: ViewObservationProps) => ({
  observation: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  removeObservation: removeObservationAction,
};

const ConnectedViewObservation = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewObservation);

export default withForwardedNavigationParams<ForwardedViewObservationProps>()(
  ConnectedViewObservation,
);
