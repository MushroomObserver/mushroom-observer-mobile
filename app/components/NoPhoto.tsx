import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors, Text, View } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';

const NoPhoto = ({
  width,
  height,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
}: {
  width?: number;
  height?: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
}) => (
  <View
    style={{
      width,
      height,
      borderRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
    }}
    center
    backgroundColor={Colors.grey80}
  >
    <Icon name="eye-slash" size={25} color={Colors.grey40} />
    <Text text100L grey40>
      No Photo
    </Text>
  </View>
);

export default NoPhoto;
