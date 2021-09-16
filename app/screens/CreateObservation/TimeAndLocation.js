import React from 'react';
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

import {Row, Field, Label, Sublabel, Input} from '../../components';

import {getElevation, getGeocode} from '../../api/google';

const TimeAndLocation = ({navigation, route}) => {
  const [when, setWhen] = React.useState(new Date());
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [where, setWhere] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [elevation, setElevation] = React.useState('');
  const [foundHere, setFoundHere] = React.useState(true);
  const [hideCoordinates, setHideCoordinates] = React.useState(false);

  const onChangeWhen = (_, selectedDate = when) => {
    setShowDatePicker(false);
    setWhen(new Date(selectedDate));
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Next"
          onPress={() => navigation.navigate('Identification and Notes')}
        />
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    if (route.params?.region) {
      const region = route.params.region;
      setLatitude(region.latitude);
      setLongitude(region.longitude);

      const fetchElevation = async () => {
        const newElevation = await getElevation(
          region.latitude,
          region.longitude,
        );
        setElevation(newElevation);
      };
      fetchElevation();
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
                  title={when.toLocaleDateString('en-US')}
                  onPress={() => setShowDatePicker(true)}
                />
              )}
              {Platform.OS === 'ios' ||
                (showDatePicker && (
                  <DateTimePicker
                    value={when}
                    // style={{width: 115, backfaceVisibility: false}} // Fix for https://github.com/react-native-datetimepicker/datetimepicker/issues/339
                    maximumDate={new Date()}
                    mode="date"
                    display="calendar"
                    onChange={onChangeWhen}
                  />
                ))}
            </Row>
          </Field>
          <Field>
            <Label>Where (required)</Label>
            <Row>
              <Input value={where} onChangeText={setWhere} />
              <Button
                title="Locate"
                disabled={!(where?.length > 0)}
                onPress={async () => {
                  const newLocation = await getGeocode(where);
                  navigation.navigate('Select Location', newLocation);
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
              <Switch value={foundHere} onValueChange={setFoundHere} />
            </Row>
          </Field>
          <Row>
            <Field>
              <Label>Latitude</Label>
              <Input value={`${latitude}`} />
            </Field>
            <Field>
              <Label>Longitude</Label>
              <Input value={`${longitude}`} />
            </Field>
            <Field>
              <Label>Elevation</Label>
              <Input value={`${elevation}`} />
            </Field>
          </Row>
          <Field>
            <Row>
              <Label>Hide exact coordinates?</Label>
              <Switch
                value={hideCoordinates}
                onValueChange={setHideCoordinates}
              />
            </Row>
          </Field>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TimeAndLocation;
