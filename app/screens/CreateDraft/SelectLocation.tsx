import {
  selectById,
  updateDraftObservation,
  updateDraftObservation as updateDraftObservationAction,
} from '../../store/draftObservations';
import { useGeocodeQuery } from '../../store/google';
import { ForwardedSelectLocationProps } from '../../types/navigation';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.052;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface SelectLocationProps extends PropsFromRedux {
  id: string;
}

const SelectLocation = ({ id, draftObservation }: SelectLocationProps) => {
  const navigation = useNavigation();

  const { isUninitialized, isLoading, isSuccess, data, isError, error } =
    useGeocodeQuery(draftObservation?.location);
  console.log({
    isUninitialized,
    isLoading,
    isSuccess,
    data,
    isError,
    error,
  });

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const {
    results: [
      {
        geometry: {
          location: { lat, lng },
        },
      },
    ],
  } = data;
  setRegion({
    latitude: lat,
    longitude: lng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Select"
          onPress={async () => {
            updateDraftObservation({
              id,
              changes: {
                latitude: region.latitude,
                longitude: region.longitude,
              },
            });
            navigation.navigate('Time and Location', { id });
          }}
        />
      ),
    });
  }, [navigation, region]);

  return (
    <View style={mapStyles.container}>
      <MapView
        provider="google"
        style={mapStyles.map}
        initialRegion={region}
        onRegionChange={setRegion}
      >
        <Marker coordinate={region} />
      </MapView>
      <View style={[mapStyles.bubble, mapStyles.latlng]}>
        <Text style={mapStyles.centeredText}>
          {region.latitude?.toPrecision(5)},{region.longitude?.toPrecision(5)}
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

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservation: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  updateDraftObservation: updateDraftObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedSelectLocation = connector(SelectLocation);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedSelectLocationProps>()(
  ConnectedSelectLocation,
);
