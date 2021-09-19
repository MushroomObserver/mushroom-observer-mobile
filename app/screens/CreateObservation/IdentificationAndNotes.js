import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {Field, Label, Sublabel, Input} from '../../components';

const IdentificationAndNotes = ({navigation, route}) => {
  const [confidence, setConfidence] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" />,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Field>
            <Label>Confidence</Label>
            <RNPickerSelect
              style={pickerSelectStyles}
              items={[
                {label: "I'd Call It That", value: 3.0},
                {label: 'Promising', value: 2.0},
                {label: 'Could Be', value: 1.0},
                {label: 'Doubtful', value: -1.0},
                {label: 'Not Likely', value: -2.0},
                {label: 'As If!', value: -3.0},
              ]}
              onValueChange={setConfidence}
              selectedValue={confidence}
            />
          </Field>
          <Field>
            <Label>Notes</Label>
            <Input
              numberOfLines={4}
              value={notes}
              multiline={true}
              onChange={setNotes}
            />
            <Sublabel>
              Please include any additional information you can think of about
              this observation that isn’t clear from the photographs, e.g.,
              habitat, substrate or nearby trees; distinctive texture, scent,
              taste, staining or bruising; results of chemical or microscopic
              analyses, etc.
            </Sublabel>
          </Field>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: '#007bff',
    margin: 8,
    fontSize: 18,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 18,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default IdentificationAndNotes;
