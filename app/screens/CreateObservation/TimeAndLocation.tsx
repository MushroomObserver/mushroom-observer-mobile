import { useNavigation, useRoute } from '@react-navigation/core';
import dayjs from 'dayjs';
import { filter } from 'lodash-es';
import React, { useLayoutEffect, useRef, useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';

import { selectDraft, updateDraft } from '../../store/draft';
import { selectAll } from '../../store/locations';

const TimeAndLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const draft = useSelector(selectDraft);
  const locationRef = useRef();

  const [date, setDate] = useState(dayjs(draft.date).toDate());

  const [query, setQuery] = useState('');
  const locations = useSelector(selectAll);
  const [location, setLocation] = useState(draft.location);

  const [latitude, setLatitude] = useState(draft.latitude);
  const [longitude, setLongitude] = useState(draft.longitude);
  const [altitude, setAltitude] = useState(draft.altitude);

  const [is_collection_location, setIsCollectionLocation] = useState(
    draft.is_collection_location,
  );
  const [gps_hidden, setGpsHidden] = useState(draft.gps_hidden);

  const onChangeDate = (_, selectedDate = date) => {
    setDate(new Date(selectedDate));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <NativeButton
          disabled={!location}
          title="Next"
          onPress={() => {
            dispatch(
              updateDraft({
                date: dayjs(date).format('YYYYMMDD'),
                location,
                latitude,
                longitude,
                altitude,
                is_collection_location,
                gps_hidden,
              }),
            );
            navigation.navigate('Identification and Notes');
          }}
        />
      ),
    });
  }, [
    altitude,
    date,
    dispatch,
    gps_hidden,
    is_collection_location,
    latitude,
    location,
    longitude,
    navigation,
  ]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-30>
          <DateTimePicker
            title={'Date'}
            value={date}
            maximumDate={new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
          <Picker
            ref={locationRef}
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
              dispatch(
                updateDraft({
                  date: dayjs(date).format('YYYYMMDD'),
                  location,
                  latitude,
                  longitude,
                  altitude,
                  is_collection_location,
                  gps_hidden,
                }),
              );
              navigation.navigate('Select Location');
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
              value={is_collection_location}
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
            <Switch value={gps_hidden} onValueChange={setGpsHidden} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TimeAndLocation;
