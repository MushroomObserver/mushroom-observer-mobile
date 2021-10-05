import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';

import { getElevation, getGeocode } from '../../api/google';
import { selectDraft, updateDraft } from '../../store/draft';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.052;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SelectLocation = () => {
  const navigation = useNavigation();

  const draft = useSelector(selectDraft);
  const dispatch = useDispatch();

  const [region, setRegion] = useState({
    latitude: draft.latitude,
    longitude: draft.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Select"
          onPress={async () => {
            const altitude = await getElevation(
              region.latitude,
              region.longitude,
            );

            dispatch(
              updateDraft({
                latitude: region.latitude,
                longitude: region.longitude,
                altitude,
              }),
            );
            navigation.navigate({ name: 'Time and Location', merge: true });
          }}
        />
      ),
    });
  }, [dispatch, navigation, region]);

  useEffect(() => {
    const getCoordinates = async () => {
      const coordinates = await getGeocode(draft.location);
      console.log(coordinates);
    };
    getCoordinates();
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
          {region.latitude.toPrecision(5)},{region.longitude.toPrecision(5)}
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
  centeredText: { textAlign: 'center' },
});
export default SelectLocation;
