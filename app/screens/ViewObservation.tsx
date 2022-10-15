import { ConfidenceView } from '../components/ConfidenceView';
import { DateView } from '../components/DateView';
import { NameView } from '../components/NameView';
import { OwnerView } from '../components/OwnerView';
import getImageUri from '../hooks/useGetImageUri';
import { selectById as selectImageById } from '../store/images';
import {
  removeObservation as removeObservationAction,
  selectById as selectObservationById,
} from '../store/observations';
import { ForwardedViewObservationProps } from '../types/navigation';
import { useNavigation, useRoute } from '@react-navigation/core';
import { concat, first, nth } from 'lodash';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import {
  Carousel,
  Card,
  Colors,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect } from 'react-redux';

interface ViewObservationProps {
  id: number;
}

const { width: screenWidth } = Dimensions.get('window');

const ViewObservation = ({
  id,
  observation,
  photos,
}: ForwardedViewObservationProps) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-s4>
          <Card>
            <View row spread padding-s2>
              <Text text80M grey10>
                Observation #{id}
              </Text>
              <Text text80M grey30>
                <DateView date={observation.date} format="ll" />
              </Text>
            </View>
            {photos.length != 0 && (
              <Carousel showCounter horizontal allowAccessibleLayout>
                {concat(photos).map(photo => (
                  <TouchableOpacity
                    key={photo.id}
                    onPress={() =>
                      navigation.navigate('View Photo', {
                        id: photo.id,
                      })
                    }
                  >
                    <Image
                      source={{ uri: getImageUri(first(photo.files)) }}
                      height={340}
                      blurRadius={1}
                    />
                    <View absF center>
                      {(() => {
                        const aspectRatio = photo.width / photo.height;
                        console.log(photo);
                        return (
                          <Image
                            source={{ uri: getImageUri(nth(photo.files, -3)) }}
                            key={photo.id}
                            aspectRatio={aspectRatio}
                            width={aspectRatio < 1 ? undefined : '100%'}
                            height={aspectRatio < 1 ? '100%' : undefined}
                          />
                        );
                      })()}
                    </View>
                    <View
                      absB
                      absH
                      padding-s2
                      backgroundColor={Colors.rgba(Colors.white, 0.7)}
                    >
                      <Text text90M grey10>
                        Notes
                      </Text>
                      <Text text90R grey10 numberOfLines={1}>
                        {photo.notes?.replace(/<(.|\n)*?>/g, '')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </Carousel>
            )}
            <View paddingT-0={photos.length === 0} padding-s2>
              <Text text60M marginB-s2>
                <NameView name={observation.consensus} />
              </Text>
              <Text text90M grey10>
                Location
              </Text>
              <Text text90R grey10 marginB-s2>
                {observation.location_name}
              </Text>
              <View row spread>
                <View marginB-s2>
                  <Text text90M grey10 marginR-s1>
                    Coordinates
                  </Text>
                  <Text text90R grey10>
                    {observation?.latitude} {observation?.longitude}{' '}
                    {observation?.altitude}m
                  </Text>
                  <View row centerV>
                    <Icon
                      name={observation.gps_hidden ? 'lock' : 'unlock'}
                      color={Colors.grey30}
                    />
                    <Text marginL-s1 text100M grey30>
                      {observation.gps_hidden
                        ? 'Hidden from public'
                        : 'Visible to public'}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text text90M grey10>
                    Confidence
                  </Text>
                  <Text text90R>
                    <ConfidenceView confidence={observation.confidence} />
                  </Text>
                </View>
              </View>
              <Text text90M grey10>
                Notes
              </Text>
              <Text text90R grey10>
                {observation.notes?.replace(/<(.|\n)*?>/g, '')}
              </Text>
            </View>
            <View flex row spread padding-s2>
              <View>
                <Text text100M grey10>
                  Owner
                </Text>
                <Text text100L>
                  <OwnerView owner={observation.owner} />
                </Text>
              </View>
              <View>
                <Text text100M grey10>
                  Created At
                </Text>
                <Text text100L>
                  <DateView date={observation.created_at} format="lll" />
                </Text>
              </View>
              <View>
                <Text text100M grey10>
                  Updated At
                </Text>
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

const mapStateToProps = (state: any, ownProps: ViewObservationProps) => {
  const observation = selectObservationById(state, ownProps.id);
  const photos = observation.photoIds.map((id: string) =>
    selectImageById(state, id),
  );
  return {
    observation,
    photos,
  };
};

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
