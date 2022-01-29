import { OwnerView } from '../components/OwnerView';
import { Naming } from '../types/store';
import { ConfidenceView } from './ConfidenceView';
import { NameView } from './NameView';
import React from 'react';
import { View } from 'react-native-ui-lib';

export const NamingView = ({ naming }: { naming: Naming }) => {
  if (naming) {
    return (
      <View row>
        <NameView name={naming.name} />
        <ConfidenceView confidence={naming.confidence} />
        <OwnerView owner={naming.owner} />
      </View>
    );
  }
  return null;
};
