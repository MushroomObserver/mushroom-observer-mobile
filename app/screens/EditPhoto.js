import React from 'react';
import {
  Button,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

import {Row, Field, Label, Sublabel, Input} from '../components';
import {useNavigation, useRoute} from '@react-navigation/core';

const EditPhoto = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const [copyrightHolder, setCopyrightHolder] = React.useState('');
  const [when, setWhen] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(
    Platform.OS === 'ios',
  );
  const [license, setLicense] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const onChangeWhen = (_, selectedDate = when) => {
    setShowDatePicker(false);
    setWhen(new Date(selectedDate));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" />,
    });
  }, [navigation, route]);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Field>
            <Image
              style={{width: '100%', height: 300, borderRadius: 10}}
              resizeMethod="scale"
              source={{uri: route.params.uri}}
            />
          </Field>
          <Field>
            <Label>Copyright holder</Label>
            <Input value={copyrightHolder} onChange={setCopyrightHolder} />
          </Field>
          <Field>
            <Row>
              <Label>When</Label>
              {Platform.OS === 'android' && (
                <Button
                  title={when.toLocaleDateString('en-US')}
                  onPress={() => setShowDatePicker(true)}
                />
              )}
              {showDatePicker && (
                <DateTimePicker
                  value={when}
                  style={{width: 80, backfaceVisibility: false}} // Fix for https://github.com/react-native-datetimepicker/datetimepicker/issues/339
                  maximumDate={new Date()}
                  mode="date"
                  display="default"
                  onChange={onChangeWhen}
                />
              )}
            </Row>
            <Sublabel>Date the photograph or drawing was created.</Sublabel>
          </Field>
          <Field>
            <Label>License</Label>
            <RNPickerSelect
              style={pickerSelectStyles}
              items={[
                {label: 'Creative Commons Non-commercial v3.0', value: 3.0},
                {
                  label: 'Creative Commons Wikipedia Compatible v3.0',
                  value: 2.0,
                },
                {label: 'Public Domain', value: 1.0},
              ]}
              onValueChange={setLicense}
              value={license}
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
              Enter notes that are specific to this particular image.
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

export default EditPhoto;
