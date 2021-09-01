import React from 'react';
import {Button, Switch, Text, View} from 'react-native';
import Config from 'react-native-config';

import {Row, Field, Label, Sublabel, Input} from '../../components';

const Location = ({navigation}) => {
  const [where, setWhere] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [elevation, setElevation] = React.useState('');
  const [foundHere, setFoundHere] = React.useState(true);
  const [hideCoordinates, setHideCoordinates] = React.useState(false);

  return (
    <View>
      <Field>
        <Label>Where (required)</Label>
        <Row>
          <Input value={where} onChangeText={setWhere} />
          <Button
            title="Locate"
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
          bring this location up on the map. Then click to add a marker and drag
          it to the specific Latitude & Longitude.
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
          <Input value={latitude} />
        </Field>
        <Field>
          <Label>Longitude</Label>
          <Input value={longitude} />
        </Field>
        <Field>
          <Label>Elevation</Label>
          <Input value={elevation} />
        </Field>
      </Row>
      <Field>
        <Row>
          <Label>Hide exact coordinates?</Label>
          <Switch value={hideCoordinates} onValueChange={setHideCoordinates} />
        </Row>
      </Field>
    </View>
  );
};

export default Location;
