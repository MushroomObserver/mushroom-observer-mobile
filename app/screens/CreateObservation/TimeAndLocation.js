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

import {useNavigation, useRoute} from '@react-navigation/core';

import {Row, Field, Label, Sublabel, Input} from '../../components';

import {getElevation, getGeocode} from '../../api/google';

const TimeAndLocation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [altitude, setAltitude] = useState('');
  const [isCollectionLocation, setIsCollectionLocation] = useState(true);
  const [gpsHidden, setGpsHidden] = useState(false);

  const onChangeDate = (_, selectedDate = date) => {
    setShowDatePicker(false);
    setDate(new Date(selectedDate));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Next"
          onPress={() => {
            navigation.navigate('Identification and Notes');
          }}
        />
      ),
    });
  }, [navigation]);

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
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
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
              {showDatePicker && (
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
              bring this location up on the map. Then click to add a marker and
              drag it to the specific Latitude & Longitude.
            </Sublabel>
          </Field>
          <Field>
            <Row>
              <Label>Is this location where it was collected?</Label>
              <Switch
                value={isCollectionLocation}
                onValueChange={setIsCollectionLocation}
              />
            </Row>
          </Field>
          <Row>
            <Field>
              <Label>Latitude</Label>
              <Input value={`${latitude}`} onChange={setLatitude} />
            </Field>
            <Field>
              <Label>Longitude</Label>
              <Input value={`${longitude}`} onChange={setLongitude} />
            </Field>
            <Field>
              <Label>Altitude</Label>
              <Input value={`${altitude}`} onChange={setAltitude} />
            </Field>
          </Row>
          <Field>
            <Row>
              <Label>Hide exact coordinates?</Label>
              <Switch value={gpsHidden} onValueChange={setGpsHidden} />
            </Row>
          </Field>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TimeAndLocation;
