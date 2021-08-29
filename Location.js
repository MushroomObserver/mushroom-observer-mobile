import React from 'react';
import {Button, Switch, Text, TextInput, View} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {Marker} from 'react-native-maps';

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

const Location = () => {
  const [where, setWhere] = React.useState('');
  const [foundHere, setFoundHere] = React.useState(true);
  const [coordinate, setCoordinate] = React.useState({});
  const [elevation, setElevation] = React.useState('');
  const [hideCoordinates, setHideCoordinates] = React.useState(false);
  const [region, setRegion] = React.useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.009,
    longitudeDelta: 0.009,
  });

  React.useEffect(() => {
    const getLocation = async () => {
      const newRegion = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 1000,
      });
      setRegion({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      });
      setCoordinate({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      });
    };
    getLocation();
  });

  return (
    <View>
      <Field>
        <Label>Where (required)</Label>
        {region && (
          <MapView
            provider="google"
            style={{flex: 1, height: 400}}
            initialRegion={region}>
            <Marker coordinate={coordinate} />
          </MapView>
        )}
        <Row>
          <Input value={where} onChange={setWhere} />
          <Button
            title="Locate"
            onPress={() => {
              GetLocation.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: 1000,
              })
                .then(location => {
                  setRegion({
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                  });
                })
                .catch(error => {
                  alert(error);
                  console.warn(error);
                });
            }}
          />
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
          <Input value={region.latitude} />
        </Field>
        <Field>
          <Label>Longitude</Label>
          <Input value={region.longitude} />
        </Field>
        <Field>
          <Label>Elevation</Label>
          <Input value={elevation.toString()} />
        </Field>
      </View>
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
