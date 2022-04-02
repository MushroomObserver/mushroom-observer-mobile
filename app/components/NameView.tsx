import { Name } from '../types/store';
import React from 'react';
import { Text } from 'react-native-ui-lib';

export const NameView = ({ name }: { name: Name }) => {
  if (name) {
    return (
      <Text>
        {name.name} {name?.author}
      </Text>
    );
  }
  return null;
};
