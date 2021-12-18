import useDayjs from '../../hooks/useDayjs';
import {
  selectById,
  updateDraftObservation as updateDraftObservationAction,
} from '../../store/draftObservations';
import { selectAll } from '../../store/locations';
import { ForwardedTimeAndLocationProps } from '../../types/navigation';
import { useNavigation } from '@react-navigation/core';
import { filter } from 'lodash-es';
import React, { useLayoutEffect, useState } from 'react';
import { Button as NativeButton, ScrollView } from 'react-native';
import {
  Button,
  DateTimePicker,
  Picker,
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
  locations,
  draftObservation,
  updateDraftObservation,
}: TimeAndLocationProps) => {
  const navigation = useNavigation();
  const dayjs = useDayjs();
  const [date, setDate] = useState(dayjs(draftObservation.date).toDate());

  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(draftObservation.location);

  const [latitude, setLatitude] = useState(draftObservation.latitude);
  const [longitude, setLongitude] = useState(draftObservation.longitude);
  const [altitude, setAltitude] = useState(draftObservation.altitude);

  const [isCollectionLocation, setIsCollectionLocation] = useState(
    draftObservation.isCollectionLocation,
  );
  const [gpsHidden, setGpsHidden] = useState(draftObservation.gpsHidden);

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
            value={date}
            mode="date"
            display="default"
            onChange={setDate}
          />
          <Picker
            showSearch
            title="Location"
            value={{ label: location, value: location }}
            onChange={item => {
              setLocation(item.value);
            }}
            onSearchChange={setQuery}
            listProps={{
              data: filter(locations, n => n.name.startsWith(query)),
              renderItem: ({ item }) => (
                <Picker.Item
                  key={item.id}
                  value={item.name}
                  label={item.name}
                />
              ),
            }}
            validate="required"
            errorMessage="This field is required"
          />
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
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Use the Locate Button</Text> to
            bring this location up on the map. Then click to add a marker and
            drag it to the specific Latitude & Longitude.
          </Text>
          <View marginV-15 spread row centerV>
            <Text>Is this location where it was collected?</Text>
            <Switch
              value={isCollectionLocation}
              onValueChange={setIsCollectionLocation}
            />
          </View>
          <View spread row>
            <View flex>
              <TextField
                title="Latitude"
                value={latitude}
                maxLength={5}
                keyboardType="numeric"
                onChangeText={setLatitude}
              />
            </View>
            <View flex marginH-30>
              <TextField
                title="Longitude"
                value={longitude}
                maxLength={5}
                keyboardType="numeric"
                onChangeText={setLongitude}
              />
            </View>
            <View flex>
              <TextField
                title="Altitude"
                value={altitude}
                maxLength={5}
                keyboardType="numeric"
                onChangeText={setAltitude}
              />
            </View>
          </View>
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
  locations: selectAll(state),
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
