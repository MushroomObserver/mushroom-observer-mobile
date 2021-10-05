import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import {useNavigation, useRoute} from '@react-navigation/core';

import {Row, Field, Label, Sublabel, Input} from '../../components';

import {getElevation, getGeocode} from '../../api/google';
import {useDispatch, useSelector} from 'react-redux';
import {selectDraft, updateDraft} from '../../store/draft';
import {selectAll} from '../../store/locations';

const TimeAndLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const draft = useSelector(selectDraft);

  const [date, setDate] = useState(dayjs(draft.date).toDate());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

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
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setDate(new Date(selectedDate));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
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

  useEffect(() => {
    if (route.params?.region) {
      const region = route.params.region;
      setLatitude(region.latitude);
      setLongitude(region.longitude);

      const fetchAltitude = async () => {
        const newAltitude = await getElevation(
          region.latitude,
          region.longitude,
        );
        setAltitude(newAltitude);
      };
      fetchAltitude();
    }
  }, [route.params?.region]);

  return (
    <View>
      <Field>
        <Row>
          <Label>When</Label>
          {Platform.OS === 'android' && (
            <Button
              title={date.toLocaleDateString('en-US')}
              onPress={() => setShowDatePicker(true)}
            />
          )}
          {(Platform.OS === 'ios' || showDatePicker) && (
            <DateTimePicker
              value={date}
              style={{width: 80, backfaceVisibility: false}} // Fix for https://github.com/react-native-datetimepicker/datetimepicker/issues/339
              maximumDate={new Date()}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </Row>
      </Field>
      <Field>
        <Label>Where (required)</Label>
        <Row>
          <Input value={location} onChangeText={setLocation} />
          <Button
            title="Locate"
            disabled={!(location?.length > 0)}
            onPress={async () => {
              const coordinates = await getGeocode(location);
              navigation.navigate('Select Location', coordinates);
            }}
          />
        </Row>
        <Sublabel>
          Where the observation was made. In the US this should be at least
          accurate to the county. Examples:
        </Sublabel>
        <Sublabel>
          <Text style={{fontStyle: 'italic'}}>
            Albion, Mendocino Co., California, USA
          </Text>
        </Sublabel>
        <Sublabel>
          <Text style={{fontStyle: 'italic'}}>
            Hotel Parque dos Coqueiros, Aracaju, Sergipe, Brazil
          </Text>
        </Sublabel>
        <Sublabel>
          <Text style={{fontWeight: 'bold'}}>Use the Locate Button</Text> to
          bring this location up on the map. Then click to add a marker and drag
          it to the specific Latitude & Longitude.
        </Sublabel>
      </Field>
      <Field>
        <Row>
          <Label>Is this location where it was collected?</Label>
          <Switch
            value={is_collection_location}
            onValueChange={setIsCollectionLocation}
          />
        </Row>
      </Field>
      <Row>
        <Field>
          <Label>Latitude</Label>
          <Input value={`${latitude}`} onChangeText={setLatitude} />
        </Field>
        <Field>
          <Label>Longitude</Label>
          <Input value={`${longitude}`} onChangeText={setLongitude} />
        </Field>
        <Field>
          <Label>Altitude</Label>
          <Input value={`${altitude}`} onChangeText={setAltitude} />
        </Field>
      </Row>
      <Field>
        <Row>
          <Label>Hide exact coordinates?</Label>
          <Switch value={gps_hidden} onValueChange={setGpsHidden} />
        </Row>
      </Field>
    </View>
  );
};

export default TimeAndLocation;
