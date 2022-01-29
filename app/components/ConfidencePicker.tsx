import React from 'react';
import { Picker } from 'react-native-ui-lib';

interface ConfidencePickerProps {
  confidence: number | undefined;
  onChangeConfidence: Function;
}

export const ConfidencePicker = ({
  confidence,
  onChangeConfidence,
}: ConfidencePickerProps) => {
  return (
    <Picker title="Confidence" onChange={onChangeConfidence} value={confidence}>
      <Picker.Item value={3.0} label="I'd Call It That" />
      <Picker.Item value={2.0} label="Promising" />
      <Picker.Item value={1.0} label="Could Be" />
      <Picker.Item value={-1.0} label="Doubtful" />
      <Picker.Item value={-2.0} label="Not Likely" />
      <Picker.Item value={-3.0} label="As If!" />
    </Picker>
  );
};
