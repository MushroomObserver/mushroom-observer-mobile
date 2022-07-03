import useDayjs from '../../../hooks/useDayjs';
import NoPhoto from '../../NoPhoto';
import React from 'react';
import { Card, Image, Text, View } from 'react-native-ui-lib';

export interface ListItemLayoutProps {
  uri?: string;
  title: string;
  date: string;
  name?: string;
  location?: string;
  coordinates?: string;
  onPress: () => void;
}

export const ListItemLayout = ({
  uri,
  title,
  date,
  name,
  location,
  coordinates,
  onPress,
}: ListItemLayoutProps) => {
  const dayjs = useDayjs();
  return (
    <Card
      flex
      row
      marginV-5
      marginH-10
      borderRadius={10}
      enableShadow
      onPress={onPress}
    >
      {(uri && (
        <Image
          width={90}
          source={{ uri }}
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
    </Card>
  );
};
export default ListItemLayout;
