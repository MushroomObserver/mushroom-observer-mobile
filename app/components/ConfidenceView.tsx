import { find, get, round } from 'lodash';
import React from 'react';
import { Text } from 'react-native-ui-lib';

export const ConfidenceView = ({ confidence }: { confidence: number }) => {
  if (confidence) {
    const label = get(
      find(
        [
          { value: 3.0, label: "I'd Call It That" },
          { value: 2.0, label: 'Promising' },
          { value: 1.0, label: 'Could Be' },
          { value: -1.0, label: 'Doubtful' },
          { value: -2.0, label: 'Not Likely' },
          { value: -3.0, label: 'As If!' },
        ],
        { value: round(confidence) },
      ),
      'label',
    );
    if (label) {
      return <Text>{label}</Text>;
    }
  }
  return null;
};
