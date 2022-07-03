import useDayjs from '../hooks/useDayjs';
import React from 'react';
import { Text, View } from 'react-native-ui-lib';

export interface ObservationDetailsProps {
  title: string;
  date: string;
  name: string;
  location: string;
  coordinates: string;
}

export const ObservationDetails = ({
  title,
  date,
  name,
  location,
  coordinates,
}: ObservationDetailsProps) => {
  const dayjs = useDayjs();
  return (
    <View flex flexG padding-s2>
      <View row spread>
        <Text text100M grey10>
          {title}
        </Text>
        <Text text100M grey30>
          {dayjs(date).format('ll')}
        </Text>
      </View>
      <Text text80M grey10 numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
      <Text text90L grey10 numberOfLines={1} ellipsizeMode="tail">
        {location}
      </Text>
      <Text text90L grey10>
        {coordinates}
      </Text>
    </View>
  );
};
export default ObservationDetails;
