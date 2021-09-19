import React from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';

import {Field, Label, Sublabel, Input} from '../../components';

import Photos from './PhotoPicker';
import {useNavigation} from '@react-navigation/core';

const NameAndPhotos = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Next"
          onPress={() => navigation.navigate('Time and Location')}
        />
      ),
    });
  }, [navigation]);

  const [what, setWhat] = React.useState(null);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Field>
            <Label>What</Label>
            <Input value={what} onChange={setWhat} />
            <Sublabel>
              The name you would apply to this observation. If you don’t know
              what it is, just leave it blank. If you find a better name in the
              future, you can always propose a name later.
            </Sublabel>
            <Sublabel>
              <Text style={{fontWeight: 'bold'}}>
                Scientific names are currently required,
              </Text>{' '}
              but do not include any author information. If multiple names
              apply, you will be given the option to select between them. If the
              name is not recognized in the database, then you will be given the
              option to add the name or fix the spelling if it’s just a typo.
            </Sublabel>
          </Field>
          <Photos />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NameAndPhotos;
