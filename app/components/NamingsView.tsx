import { Naming } from '../types/store';
import { NamingView } from './NamingView';
import { map } from 'lodash';
import React from 'react';
import { View } from 'react-native-ui-lib';

export const NamingsView = ({ namings }: { namings: Naming[] }) => {
  if (namings) {
    return (
      <View>
        {map(namings, naming => (
          <NamingView naming={naming} />
        ))}
      </View>
    );
  }
  return null;
};
