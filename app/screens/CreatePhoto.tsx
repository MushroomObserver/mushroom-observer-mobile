import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/core';
import React from 'react';
import { Button as NativeButton, ScrollView } from 'react-native';
import { Image, Picker, Text, TextField, View } from 'react-native-ui-lib';

const CreatePhoto = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [copyrightHolder, setCopyrightHolder] = React.useState('');
  const [when, setWhen] = React.useState(new Date());
  const [license, setLicense] = React.useState('');
  const [notes, setNotes] = React.useState('');

  const onChangeWhen = (_: Event, selectedDate = when) => {
    setWhen(new Date(selectedDate));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <NativeButton title="Save" onPress={() => {}} />,
    });
  }, [navigation, route]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Image
            style={{ width: '100%', height: 300 }}
            resizeMethod="scale"
            source={{ uri: route.params.uri }}
          />
          <TextField
            title="Copyright holder"
            value={copyrightHolder}
            onChange={setCopyrightHolder}
          />
          <DateTimePicker
            value={when}
            maximumDate={new Date()}
            mode="date"
            display="default"
            onChange={onChangeWhen}
          />
          <Text>Date the photograph or drawing was created.</Text>
          <Picker title="License" onChange={setLicense} value={license}>
            <Picker.Item
              value={3.0}
              label="Creative Commons Non-commercial v3.0"
            />
            <Picker.Item
              value={2.0}
              label="Creative Commons Wikipedia Compatible v3.0"
            />
            <Picker.Item value={1.0} label="Public Domain" />
          </Picker>
          <TextField
            title="Notes"
            value={notes}
            onChangeText={setNotes}
            expandable
            multiline
          />
          <Text>Enter notes that are specific to this particular image.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CreatePhoto;
