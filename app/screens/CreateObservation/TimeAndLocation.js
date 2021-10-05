import { useNavigation, useRoute } from '@react-navigation/core';
import dayjs from 'dayjs';
import { filter } from 'lodash-es';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';
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
        <Button
          link
          label="Next"
          onPress={() => {
            dispatch(
              updateDraft({
                date: dayjs(date).format('YYYYMMDD'),
                location: location.value,
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

  useEffect(() => {
    // if (route.params?.merge) {
    //   const region = route.params.region;
    //   setLatitude(region.latitude);
    //   setLongitude(region.longitude);
    //   const fetchAltitude = async () => {
    //     const newAltitude = await getElevation(
    //       region.latitude,
    //       region.longitude,
    //     );
    //     setAltitude(newAltitude);
    //   };
    //   fetchAltitude();
    // }
  }, [route.params.merge]);

  return (
    <SafeAreaView>
      <StatusBar />
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
            showSearch
            title="Location"
            value={location}
            onChange={setLocation}
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
          />
          <Button
            label="Locate"
            disabled={!location}
            onPress={() => navigation.navigate('Select Location')}
          />
          <Text>
            Where the observation was made. In the US this should be at least
            accurate to the county. Examples:
          </Text>
          <Text>
            <Text style={{ fontStyle: 'italic' }}>
              Albion, Mendocino Co., California, USA
            </Text>
          </Text>
          <Text>
            <Text style={{ fontStyle: 'italic' }}>
              Hotel Parque dos Coqueiros, Aracaju, Sergipe, Brazil
            </Text>
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>Use the Locate Button</Text> to
            bring this location up on the map. Then click to add a marker and
            drag it to the specific Latitude & Longitude.
          </Text>
          <View spread row centerV>
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
                value={`${latitude}`}
                maxLength={5}
                keyboardType="numeric"
                onChangeText={setLatitude}
              />
            </View>
            <View flex marginH-30>
              <TextField
                title="Longitude"
                value={`${longitude}`}
                maxLength={5}
                keyboardType="numeric"
                onChangeText={setLongitude}
              />
            </View>
            <View flex>
              <TextField
                title="Altitude"
                value={`${altitude}`}
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
    </SafeAreaView>
  );
};

export default TimeAndLocation;
