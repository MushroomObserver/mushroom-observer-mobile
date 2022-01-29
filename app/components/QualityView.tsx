import { find, get, round } from 'lodash';
import React from 'react';
import { Text } from 'react-native-ui-lib';

export const QualityView = ({ quality }: { quality: number }) => {
  if (quality) {
    const label = get(
      find(
        [
          { value: 4, label: 'Great' },
          { value: 3, label: 'Good' },
          { value: 2, label: 'Useful' },
          { value: 1, label: 'Okay' },
        ],
        { value: round(quality) },
      ),
      'label',
    );
    if (label) {
      return <Text>{label}</Text>;
    }
  }
  return null;
};
