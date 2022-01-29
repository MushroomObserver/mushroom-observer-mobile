import { Owner } from '../types/store';
import React from 'react';
import { Text } from 'react-native-ui-lib';

export const OwnerView = ({ owner }: { owner: Owner }) => {
  if (owner) {
    return (
      <Text>
        {owner.legal_name} ({owner.login_name})
      </Text>
    );
  }
  return null;
};
