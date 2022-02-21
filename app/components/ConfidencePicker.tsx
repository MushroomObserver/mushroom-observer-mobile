import _ from 'lodash';
import React from 'react';
import { Picker, Incubator, View, Colors, Button } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ConfidencePickerProps {
  confidence: number | undefined;
  onChangeConfidence: Function;
}

export const ConfidencePicker = ({
  confidence,
  onChangeConfidence,
}: ConfidencePickerProps) => {
  const onChange = value => {
    return onChangeConfidence(value);
  };
  return (
    <View>
      <Picker
        migrate
        migrateTextField
        renderPicker={(selectedItem: number, itemLabel: string) => {
          return (
            <Incubator.TextField
              preset="default"
              label="Confidence"
              value={itemLabel}
            />
          );
        }}
        topBarProps={{
          title: 'Confidence',
        }}
        onChange={onChange}
        value={confidence}
      >
        <Picker.Item key={3} value={3} label="I'd Call It That" />
        <Picker.Item key={2} value={2} label="Promising" />
        <Picker.Item key={1} value={1} label="Could Be" />
        <Picker.Item key={-1} value={-1} label="Doubtful" />
        <Picker.Item key={-2} value={-2} label="Not Likely" />
        <Picker.Item key={-3} value={-3} label="As If!" />
      </Picker>
      <View flex row right>
        <Button
          disabled={!confidence}
          size={Button.sizes.xSmall}
          label="Clear"
          onPress={() => {
            onChangeConfidence();
          }}
        />
      </View>
    </View>
  );
};
