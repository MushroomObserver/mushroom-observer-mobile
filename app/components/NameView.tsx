import { Name } from '../types/store';
import React from 'react';
import { Text } from 'react-native-ui-lib';

export const NameView = ({ name }: { name: Name }) => {
  console.log(name);
  if (name) {
    return (
      <Text>
        {name.name} {name?.author}
      </Text>
    );
  }
  return null;
};
