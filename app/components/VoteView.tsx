import { OwnerView } from '../components/OwnerView';
import { Vote } from '../types/store';
import { ConfidenceView } from './ConfidenceView';
import React from 'react';
import { View } from 'react-native-ui-lib';

export const VoteView = ({ vote }: { vote: Vote }) => {
  if (vote) {
    return (
      <View row>
        <ConfidenceView confidence={vote.confidence} />
        <OwnerView owner={vote.owner} />
      </View>
    );
  }
  return null;
};
