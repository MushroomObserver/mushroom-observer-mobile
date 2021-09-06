import React from 'react';
import {Button, Dimensions, StyleSheet, Text, View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.052;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SelectLocation = ({
  navigation,
  route: {
    params: {latitude, longitude},
  },
}) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Select"
          onPress={() => {
            // Pass and merge params back to home screen
            navigation.navigate({
              name: 'Create Observation',
              params: {region},
              merge: true,
            });
          }}
        />
      ),
    });
  }, [navigation, region]);

  const [region, setRegion] = React.useState({
    latitude,
    longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  return (
    <View style={mapStyles.container}>
      <MapView
        provider="google"
        style={mapStyles.map}
        initialRegion={region}
        onRegionChange={setRegion}>
        <Marker coordinate={region} />
      </MapView>
      <View style={[mapStyles.bubble, mapStyles.latlng]}>
        <Text style={mapStyles.centeredText}>
          {region.latitude.toPrecision(7)},{region.longitude.toPrecision(7)}
        </Text>
      </View>
    </View>
  );
};

const mapStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 40,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 100,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  buttonText: {
    textAlign: 'center',
  },
  centeredText: {textAlign: 'center'},
});
export default SelectLocation;
