import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  const [region, setRegion] = React.useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
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
    };
    getLocation();
  });

  return (
    <View style={mapStyles.container}>
      <MapView
        provider="google"
        style={mapStyles.map}
        initialRegion={region}
        onRegionChange={setRegion}
      />
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
export default MapScreen;
