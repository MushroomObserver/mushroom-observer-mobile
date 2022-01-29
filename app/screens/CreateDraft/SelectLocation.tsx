import {
  selectById,
  updateDraftObservation as updateDraftObservationAction,
} from '../../store/draftObservations';
import { useGeocodeQuery } from '../../store/google';
import { ForwardedSelectLocationProps } from '../../types/navigation';
import { useNavigation } from '@react-navigation/core';
import get from 'lodash/get';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Colors, LoaderScreen } from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.052;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface SelectLocationProps extends PropsFromRedux {
  id: string;
}

const SelectLocation = ({
  id,
  draftObservation,
  updateDraftObservation,
}: SelectLocationProps) => {
  const navigation = useNavigation();

  const { isUninitialized, isLoading, isSuccess, data, isError, error } =
    useGeocodeQuery(draftObservation?.location);

  const [region, setRegion] = useState({
    latitude: get(draftObservation, 'latitude', 0),
    longitude: get(draftObservation, 'longitude', 0),
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  useEffect(() => {
    setRegion({
      latitude: get(data, 'results[0].geometry.location.lat', 0),
      longitude: get(data, 'results[0].geometry.location.lng', 0),
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  }, [isSuccess, data]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Select"
          onPress={() => {
            updateDraftObservation({
              id,
              changes: {
                latitude: region.latitude.toPrecision(5),
                longitude: region.longitude.toPrecision(5),
              },
            });
            navigation.navigate('Time and Location', {
              id,
              params: {
                latitude: region.latitude.toPrecision(5),
                longitude: region.longitude.toPrecision(5),
              },
            });
          }}
        />
      ),
    });
  }, [region]);

  return (
    <View style={mapStyles.container}>
      <MapView
        provider="google"
        mapType="terrain"
        style={mapStyles.map}
        region={region}
        onRegionChange={setRegion}
      >
        <Marker coordinate={region} />
      </MapView>
      <View style={[mapStyles.bubble, mapStyles.latlng]}>
        <Text style={mapStyles.centeredText}>
          {region.latitude.toPrecision(5)},{region.longitude.toPrecision(5)}
        </Text>
      </View>
      {isLoading && (
        <LoaderScreen
          color={Colors.blue30}
          backgroundColor={Colors.grey50}
          message="Loading..."
          overlay
        />
      )}
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
