import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

import {Row, Field, Label, Sublabel, Input} from '../../components';

import Location from './Location';
import Photos from './Photos';

const CreateObservation = ({navigation}) => {
  const [when, setWhen] = React.useState(new Date());
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
                value={when}
                style={{width: 125, backfaceVisibility: false}} // Fix for https://github.com/react-native-datetimepicker/datetimepicker/issues/339
                maximumDate={new Date()}
                mode="date"
                display="default"
                onChange={onChangeWhen}
              />
            </Row>
          </Field>
          <Location navigation={navigation} />
          <Field>
            <Label>What</Label>
            <Input value={what} onChange={setWhat} />
            <Sublabel>
              The name you would apply to this observation. If you don’t know
              what it is, just leave it blank. If you find a better name in the
              future, you can always propose a name later.
            </Sublabel>
            <Sublabel>
              <Text style={{fontWeight: 'bold'}}>
                Scientific names are currently required,
              </Text>{' '}
              but do not include any author information. If multiple names
              apply, you will be given the option to select between them. If the
              name is not recognized in the database, then you will be given the
              option to add the name or fix the spelling if it’s just a typo.
            </Sublabel>
          </Field>
          <Photos />
          <Field>
            <Row>
              <Label>Confidence</Label>
              <RNPickerSelect
                style={{inputIOS: {color: '#007bff', margin: 8, fontSize: 18}}}
                items={[
                  {label: "I'd Call It That", value: 3.0},
                  {label: 'Promising', value: 2.0},
                  {label: 'Could Be', value: 1.0},
                  {label: 'Doubtful', value: -1.0},
                  {label: 'Not Likely', value: -2.0},
                  {label: 'As If!', value: -3.0},
                ]}
                onValueChange={setConfidence}
                value={confidence}
              />
            </Row>
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
            <Sublabel>
              Check when there is a preserved specimen available for further
              study.
            </Sublabel>
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

export default CreateObservation;
