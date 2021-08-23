/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import styles from './styles';

const Row = props => <View style={styles.row}>{props.children}</View>;
const Field = props => <View style={styles.field}>{props.children}</View>;
const Label = props => (
  <Text style={styles.label} {...props}>
    {props.children}
  </Text>
);
const Input = props => <TextInput style={styles.input} {...props} />;

const CreateObservation = () => {
  const [when, setWhen] = React.useState(new Date());
  const [where, setWhere] = React.useState('');
  const [foundHere, setFoundHere] = React.useState(true);
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [elevation, setElevation] = React.useState('');
  const [hideCoordinates, setHideCoordinates] = React.useState(false);
  const [what, setWhat] = React.useState('');
  const [confidence, setConfidence] = React.useState('');
  const [sight, setSight] = React.useState(false);
  const [usedReferences, setUsedReferences] = React.useState(false);
  const [microscopic, setMicroscopic] = React.useState(false);
  const [chemical, setChemical] = React.useState(false);
  const [specimenAvailable, setSpecimenAvailable] = React.useState(false);
  const [notes, setNotes] = React.useState('');

  const onChangeWhen = (event, selectedDate) => {
    const currentDate = selectedDate || when;
    setWhen(currentDate);
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Field>
            <Row>
              <Label>When</Label>
              <DateTimePicker
                style={{flexGrow: 1, margin: 0, padding: 0}}
                value={when}
                mode="date"
                display="default"
                onChange={onChangeWhen}
              />
            </Row>
          </Field>
          <Field>
            <Label>Where</Label>
            <Input value={where} onChange={setWhere} />
          </Field>
          <Field>
            <Label>Is this location where it was collected?</Label>
            <Switch value={foundHere} onValueChange={setFoundHere} />
          </Field>
          <View style={styles.row}>
            <Field>
              <Label>Latitude</Label>
              <Input value={latitude} onChange={setLatitude} />
            </Field>
            <Field>
              <Label>Longitude</Label>
              <Input value={longitude} onChange={setLongitude} />
            </Field>
            <Field>
              <Label>Elevation</Label>
              <Input value={elevation} onChange={setElevation} />
            </Field>
          </View>
          <Field>
            <Row>
              <Label>Hide exact coordinates?</Label>
              <Switch
                value={hideCoordinates}
                onValueChange={setHideCoordinates}
              />
            </Row>
          </Field>
          <Field>
            <Label>What</Label>
            <Input value={what} onChange={setWhat} />
          </Field>
          <Field>
            <Row>
              <Button
                title="Camera"
                onPress={() =>
                  launchCamera({}, response => {
                    console.log(response);
                  })
                }
              />
              <Button
                title="Gallery"
                onPress={() =>
                  launchImageLibrary({}, response => {
                    console.log(response);
                  })
                }
              />
            </Row>
          </Field>
          <Field>
            <Label>Confidence</Label>
            <Picker
              selectedValue={confidence}
              onValueChange={value => setConfidence(value)}>
              <Picker.Item label="" value="" />
              <Picker.Item label="I'd Call It That" value="3.0" />
              <Picker.Item label="Promising" value="2.0" />
              <Picker.Item label="Could Be" value="1.0" />
              <Picker.Item label="Doubtful" value="-1.0" />
              <Picker.Item label="Not Likely" value="-2.0" />
              <Picker.Item label="As If!" value="-3.0" />
            </Picker>
          </Field>
          <Field>
            <Row>
              <Label>Recognized by signt</Label>
              <Switch value={sight} onValueChange={setSight} />
            </Row>
          </Field>
          <Field>
            <Row>
              <Label>Used references</Label>
              <Switch
                value={usedReferences}
                onValueChange={setUsedReferences}
              />
            </Row>
          </Field>
          <Field>
            <Row>
              <Label>Based on microscopic features</Label>
              <Switch value={microscopic} onValueChange={setMicroscopic} />
            </Row>
          </Field>
          <Field>
            <Row>
              <Label>Based on chemical features</Label>
              <Switch value={chemical} onValueChange={setChemical} />
            </Row>
          </Field>
          <Field>
            <Row>
              <Label>Specimen available</Label>
              <Switch
                value={specimenAvailable}
                onValueChange={setSpecimenAvailable}
              />
            </Row>
          </Field>
          <Field>
            <Label>Notes</Label>
            <Input
              numberOfLines={4}
              value={notes}
              multiline={true}
              onChange={setNotes}
            />
          </Field>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateObservation;
