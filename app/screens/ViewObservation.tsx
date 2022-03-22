import { ConfidenceView } from '../components/ConfidenceView';
import { DateView } from '../components/DateView';
import { NameView } from '../components/NameView';
import { OwnerView } from '../components/OwnerView';
import Photo from '../components/Photo';
import HeaderButtons from '../components/header/HeaderButtons';
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
  Card,
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
  console.log(observation);

  const decimelToDMS = (decimel: number, lng: boolean) => {
    return [
      0 | decimel,
      '°',
      0 | (((decimel = (decimel < 0 ? -decimel : decimel) + 1e-4) % 1) * 60),
      "'",
      0 | (((decimel * 60) % 1) * 60),
      '" ',
      decimel < 0 ? (lng ? 'W' : 'S') : lng ? 'E' : 'N',
    ].join('');
  };

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

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {observation.photoIds.length > 0 && (
          <View marginT-s4>
            <Carousel
              horizontal
              allowAccessibleLayout
              pageControlPosition={Carousel.pageControlPositions.OVER}
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
                    width={screenWidth - 30}
                    height={280}
                    borderRadius={10}
                  />
                </TouchableOpacity>
              ))}
            </Carousel>
          </View>
        )}
        <View padding-s4>
          <Card padding-s2>
            <View row spread>
              <Text text90M grey10>
                Observation #{id}
              </Text>
              <Text text90M grey30>
                <DateView date={observation.date} format="ll" />
              </Text>
            </View>
            <View row spread centerV>
              <Text text70M>
                <NameView name={observation.consensus} />
              </Text>
              <Text text90L>
                <ConfidenceView confidence={observation.confidence} />
              </Text>
            </View>
            <Text text100M grey30>
              Location
            </Text>
            <Text text90R grey10>
              {observation.location_name}
            </Text>
            <Text text100M grey30>
              Coordinates
            </Text>
            <Text text90R grey10>
              {decimelToDMS(observation?.latitude, false)}{' '}
              {decimelToDMS(observation?.longitude, true)}{' '}
              {observation?.altitude}m
            </Text>
            {/* <Text text70M>
            Is collection location?:{' '}
            <Text text70>
              {observation.is_collection_location ? 'Yes' : 'No'}
            </Text>
          </Text>
          <Text text70M>
            GPS Hidden:{' '}
            <Text text70>{observation.gps_hidden ? 'Yes' : 'No'}</Text>{' '}
          </Text>
          <Text text70M>
            Specimen Available:{' '}
            <Text text70>{observation.specimen_available ? 'Yes' : 'No'}</Text>{' '}
          </Text> */}
            <View flex row spread>
              <View>
                <Text text100M>Owner</Text>
                <Text text100L>
                  <OwnerView owner={observation.owner} />
                </Text>
              </View>
              <View>
                <Text text100M>Created At</Text>
                <Text text100L>
                  <DateView date={observation.created_at} format="lll" />
                </Text>
              </View>
              <View>
                <Text text100M>Updated At</Text>
                <Text text100L>
                  <DateView date={observation.updated_at} format="lll" />
                </Text>
              </View>
            </View>
          </Card>
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
