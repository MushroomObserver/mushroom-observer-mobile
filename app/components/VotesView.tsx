import { Vote } from '../types/store';
import { VoteView } from './VoteView';
import { map } from 'lodash';
import React from 'react';
import { View } from 'react-native-ui-lib';

export const VotesView = ({ votes }: { votes: Vote[] }) => {
  if (votes) {
    return (
      <View>
        {map(votes, vote => (
          <VoteView vote={vote} />
        ))}
      </View>
    );
  }
  return null;
};
