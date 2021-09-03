import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import Config from 'react-native-config';

import {Row, Field, Label, Sublabel, Input} from '../../components';

import Photos from './Photos';

const CreateObservation = ({navigation, route}) => {
  const [when, setWhen] = React.useState(new Date());
  const [where, setWhere] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [elevation, setElevation] = React.useState('');
  const [foundHere, setFoundHere] = React.useState(true);
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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Save" />,
    });
  }, [navigation]);

  React.useEffect(() => {
    if (route.params?.region) {
      setLatitude(route.params.region.latitude);
      setLongitude(route.params.region.longitude);

      const fetchElevation = async () => {
        const elevationResponse = await fetch(
          `https://maps.googleapis.com/maps/api/elevation/json?key=${
            Config.GOOGLE_MAPS_API_KEY
          }&locations=${encodeURIComponent(
            `${route.params.region.latitude},${route.params.region.longitude}`,
          )}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        const {results} = await elevationResponse.json();
        setElevation(results[0].elevation);
      };
      fetchElevation();
    }
  }, [route.params?.region]);

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
                style={{width: 115, backfaceVisibility: false}} // Fix for https://github.com/react-native-datetimepicker/datetimepicker/issues/339
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
              <Input value={where} onChangeText={setWhere} />
              <Button
                title="Locate"
                disabled={!(where?.length > 0)}
                onPress={async () => {
                  const geocodeResponse = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?key=${
                      Config.GOOGLE_MAPS_API_KEY
                    }&address=${encodeURIComponent(where)}`,
                    {
                      method: 'GET',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                    },
                  );
                  const {
                    results: [
                      {
                        geometry: {
                          location: {lat, lng},
                        },
                      },
                    ],
                  } = await geocodeResponse.json();
                  navigation.navigate('Select Location', {
                    latitude: lat,
                    longitude: lng,
                  });
                }}
              />
            </Row>
            <Sublabel>
              Where the observation was made. In the US this should be at least
              accurate to the county. Examples:
            </Sublabel>
            <Sublabel>
              <Text style={{fontStyle: 'italic'}}>
                Albion, Mendocino Co., California, USA
              </Text>
            </Sublabel>
            <Sublabel>
              <Text style={{fontStyle: 'italic'}}>
                Hotel Parque dos Coqueiros, Aracaju, Sergipe, Brazil
              </Text>
            </Sublabel>
            <Sublabel>
              <Text style={{fontWeight: 'bold'}}>Use the Locate Button</Text> to
              bring this location up on the map. Then click to add a marker and
              drag it to the specific Latitude & Longitude.
            </Sublabel>
          </Field>
          <Field>
            <Row>
              <Label>Is this location where it was collected?</Label>
              <Switch value={foundHere} onValueChange={setFoundHere} />
            </Row>
          </Field>
          <Row>
            <Field>
              <Label>Latitude</Label>
              <Input value={`${latitude}`} />
            </Field>
            <Field>
              <Label>Longitude</Label>
              <Input value={`${longitude}`} />
            </Field>
            <Field>
              <Label>Elevation</Label>
              <Input value={`${elevation}`} />
            </Field>
          </Row>
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
