import { ConfidenceView } from '../components/ConfidenceView';
import { DateView } from '../components/DateView';
import { NameView } from '../components/NameView';
import { OwnerView } from '../components/OwnerView';
import { concat } from 'lodash';
import React from 'react';
import { Dimensions } from 'react-native';
import {
  Carousel,
  Card,
  Colors,
  Text,
  TouchableOpacity,
  View,
  Spacings,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ViewObservationProps {}

const { width: screenWidth } = Dimensions.get('window');

const ViewObservation = ({ id, observation }: ViewObservationProps) => {
  return (
    <Card>
      <View row spread>
        <Text text100M grey10>
          Observation #{id}
        </Text>
        <Text text100M grey30>
          <DateView date={observation.date} format="ll" />
        </Text>
      </View>
      {observation.photoIds.length > 0 && (
        <Carousel showCounter horizontal allowAccessibleLayout>
          {concat(observation.photoIds).map((id: string) => (
            <TouchableOpacity
              key={id}
              flex
              onPress={() =>
                navigation.navigate('View Photo', {
                  id: id,
                })
              }
            >
              <View center>
                <Photo
                  id={id}
                  key={id}
                  width={screenWidth - Spacings.s8}
                  height={280}
                  blurRadius={2}
                />
                <View absT height={280}>
                  <Photo id={id} key={id} height={280} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Carousel>
      )}
      <View row spread centerV>
        <Text text60M>
          <NameView name={observation.consensus} />
        </Text>
      </View>
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
      <Text text100M grey10>
        Notes
      </Text>
      <Text text90R grey10>
        {observation.notes?.replace(/<(.|\n)*?>/g, '')}
      </Text>
      <View flex row spread>
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
  );
};
