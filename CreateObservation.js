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
import RNPickerSelect from 'react-native-picker-select';

import PhotoCarousel from './PhotoCarousel';

import styles from './styles';

const Row = props => <View style={styles.row}>{props.children}</View>;
const Field = props => <View style={styles.field}>{props.children}</View>;
const Label = props => (
  <Text style={styles.label} {...props}>
    {props.children}
  </Text>
);
const Sublabel = props => (
  <Text style={styles.sublabel} {...props}>
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
                value={when}
                style={{width: 125, backfaceVisibility: false}} // Fix for https://github.com/react-native-datetimepicker/datetimepicker/issues/339
                maximumDate={new Date()}
                mode="date"
                display="default"
                onChange={onChangeWhen}
              />
            </Row>
          </Field>
          <Field>
            <Label>Where (required)</Label>
            <Row>
              <Input value={where} onChange={setWhere} />
              <Button title="Locate" />
            </Row>
            <Sublabel>
              Where the observation was made. In the US this should be at least
              accurate to the county. Examples:
            </Sublabel>
            <Sublabel>Albion, Mendocino Co., California, USA</Sublabel>
            <Sublabel>
              Hotel Parque dos Coqueiros, Aracaju, Sergipe, Brazil
            </Sublabel>
            <Sublabel>
              *Use the Locate Button to bring this location up on the map. Then
              click to add a marker and drag it to the specific Latitude &
              Longitude.
            </Sublabel>
          </Field>
          <Field>
            <Row>
              <Label>Is this location where it was collected?</Label>
              <Switch value={foundHere} onValueChange={setFoundHere} />
            </Row>
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
          <Field>
            <Row>
              <Label>Confidence</Label>
              <RNPickerSelect
                style={{inputIOS: {color: '#007bff', fontSize: 18}}}
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
          <PhotoCarousel />
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
