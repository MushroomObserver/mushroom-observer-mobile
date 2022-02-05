import { ConfidenceView } from '../components/ConfidenceView';
import { DateView } from '../components/DateView';
import { NameView } from '../components/NameView';
import { OwnerView } from '../components/OwnerView';
import Photo from '../components/Photo';
import HeaderButtons from '../components/header/HeaderButtons';
import useDayjs from '../hooks/useDayjs';
import {
  removeObservation as removeObservationAction,
  selectById,
} from '../store/observations';
import { ForwardedViewObservationProps } from '../types/navigation';
import { Observation } from '../types/store';
import { useNavigation, useRoute } from '@react-navigation/core';
import { concat, find, round } from 'lodash';
import React, { useLayoutEffect } from 'react';
import { Button as NativeButton, Dimensions, ScrollView } from 'react-native';
import {
  Carousel,
  Chip,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import { Item } from 'react-navigation-header-buttons';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect } from 'react-redux';

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
        <HeaderButtons>
          <Item
            title="Edit"
            onPress={() => navigation.navigate('Edit Observation', { id })}
            disabled
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, route]);

  console.log(observation);
  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View marginT-20>
          <Carousel
            horizontal
            allowAccessibleLayout
            pageControlPosition={Carousel.pageControlPositions.UNDER}
            pageControlProps={{
              color: Colors.primary,
              inactiveColor: Colors.grey30,
            }}
          >
            {concat(observation.photoIds).map((id: string) => (
              <TouchableOpacity
                key={id}
                flex
                center
                onPress={() =>
                  navigation.navigate('View Photo', {
                    id: id,
                  })
                }
              >
                <Photo
                  id={id}
                  key={id}
                  width={screenWidth - 40}
                  height={280}
                  borderRadius={10}
                />
              </TouchableOpacity>
            ))}
          </Carousel>
        </View>
        <View flex paddingH-20>
          <Text text70H>
            Date:{' '}
            <Text text70>
              <DateView date={observation.date} format="ll" />
            </Text>
          </Text>
          <Text text70H>
            Owner:{' '}
            <Text text70>
              <OwnerView owner={observation.owner} />
            </Text>
          </Text>
          <Text text70H>
            Consensus:{' '}
            <Text text70>
              <NameView name={observation.consensus} />
            </Text>
          </Text>
          <Text text70H>
            Confidence:{' '}
            <Text text70>
              <ConfidenceView confidence={observation.confidence} />
            </Text>
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
            <Text text70>
              <DateView date={observation.created_at} format="lll" />
            </Text>{' '}
          </Text>
          <Text text70H>
            Updated at:{' '}
            <Text text70>
              <DateView date={observation.updated_at} format="lll" />
            </Text>
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
