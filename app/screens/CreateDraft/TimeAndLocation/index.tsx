import LocationPicker from '../../../components/LocationPicker';
import useDayjs from '../../../hooks/useDayjs';
import {
  selectById,
  updateDraftObservation as updateDraftObservationAction,
} from '../../../store/draftObservations';
import { ForwardedTimeAndLocationProps } from '../../../types/navigation';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Button as NativeButton, ScrollView } from 'react-native';
import {
  Button,
  DateTimePicker,
  Switch,
  Text,
  TextField,
  View,
} from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps } from 'react-redux';

interface TimeAndLocationProps extends PropsFromRedux {
  id: string;
  draftObservation: any;
}

const TimeAndLocation = ({
  id,
  draftObservation,
  updateDraftObservation,
}: TimeAndLocationProps) => {
  const enableLocation = false;
  const navigation = useNavigation();
  const route = useRoute();
  const dayjs = useDayjs();
  const [date, setDate] = useState(dayjs(draftObservation?.date).toDate());

  const [location, setLocation] = useState(draftObservation?.location);

  const [latitude, setLatitude] = useState(draftObservation?.latitude);
  const [longitude, setLongitude] = useState(draftObservation?.longitude);
  const [altitude, setAltitude] = useState(draftObservation?.altitude);

  const [isCollectionLocation, setIsCollectionLocation] = useState(
    draftObservation?.isCollectionLocation,
  );
  const [gpsHidden, setGpsHidden] = useState(draftObservation?.gpsHidden);

  useEffect(() => {
    if (route.params?.latitude && route.params?.longitude) {
      setLatitude(parseFloat(route.params?.latitude));
      setLongitude(parseFloat(route.params?.longitude));
    }
  }, [route.params?.latitude, route.params?.longitude]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <NativeButton
          disabled={!location}
          title="Next"
          onPress={() => {
            updateDraftObservation({
              id,
              changes: {
                date: dayjs(date).format('YYYYMMDD'),
                location,
                latitude,
                longitude,
                altitude,
                isCollectionLocation,
                gpsHidden,
              },
            });
            navigation.navigate('Identification and Notes', { id });
          }}
        />
      ),
    });
  }, [
    altitude,
    date,
    gpsHidden,
    isCollectionLocation,
    latitude,
    location,
    longitude,
    navigation,
  ]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-20>
          <DateTimePicker
            title={'Date'}
            value={date ? date : new Date()}
            mode="date"
            display="default"
            themeVariant="light"
            onChange={setDate}
          />
          <LocationPicker
            location={location}
            onChangeLocation={item => {
              setLocation(item.value);
            }}
          />
          {enableLocation && (
            <Button
              marginB-15
              label="Locate"
              disabled={!location}
              size={Button.sizes.medium}
              onPress={() => {
                updateDraftObservation({
                  id,
                  changes: {
                    date: dayjs(date).format('YYYYMMDD'),
                    location,
                    latitude,
                    longitude,
                    altitude,
                    isCollectionLocation,
                    gpsHidden,
                  },
                });
                navigation.navigate('Select Location', { id });
              }}
            />
          )}
          <Text marginB-15>
            Where the observation was made. In the US this should be at least
            accurate to the county. Examples:
          </Text>
          <View marginB-15>
            <Text style={{ fontStyle: 'italic' }}>
              Albion, Mendocino Co., California, USA
            </Text>
            <Text style={{ fontStyle: 'italic' }}>
              Hotel Parque dos Coqueiros, Aracaju, Sergipe, Brazil
            </Text>
          </View>
          {enableLocation && (
            <Text>
              <Text style={{ fontWeight: 'bold' }}>Use the Locate Button</Text>{' '}
              to bring this location up on the map. Then click to add a marker
              and drag it to the specific Latitude & Longitude.
            </Text>
          )}
          <View marginV-15 spread row centerV>
            <Text>Is this location where it was collected?</Text>
            <Switch
              value={isCollectionLocation}
              onValueChange={setIsCollectionLocation}
            />
          </View>
          {enableLocation && (
            <View spread row>
              <View flex>
                <TextField
                  title="Latitude"
                  value={`${latitude || ''}`}
                  maxLength={5}
                  keyboardType="numeric"
                  onChangeText={lat => setLatitude(parseFloat(lat))}
                />
              </View>
              <View flex marginH-30>
                <TextField
                  title="Longitude"
                  value={`${longitude || ''}`}
                  maxLength={5}
                  keyboardType="numeric"
                  onChangeText={lng => setLongitude(parseFloat(lng))}
                />
              </View>
              <View flex>
                <TextField
                  title="Altitude"
                  value={`${altitude || ''}`}
                  maxLength={5}
                  keyboardType="numeric"
                  onChangeText={alt => setAltitude(parseFloat(alt))}
                />
              </View>
            </View>
          )}
          <View spread row centerV>
            <Text>Hide exact coordinates?</Text>
            <Switch value={gpsHidden} onValueChange={setGpsHidden} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservation: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  updateDraftObservation: updateDraftObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedTimeAndLocation = connector(TimeAndLocation);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedTimeAndLocationProps>()(
  ConnectedTimeAndLocation,
);
