import { useNavigation } from '@react-navigation/core';
import { filter } from 'lodash-es';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Button as NativeButton, ScrollView } from 'react-native';
import { Button, Picker, Text, View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';

import { clearDraft, selectDraft, updateDraft } from '../../store/draft';
import { selectAll } from '../../store/names';
import PhotoPicker from './PhotoPicker';

const NameAndPhotos = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const draft = useSelector(selectDraft);
  const [query, setQuery] = useState('');
  const [name, setName] = useState(draft.name);
  const names = useSelector(selectAll);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <NativeButton
            title="Cancel"
            onPress={() =>
              Alert.alert('Discard Observation', 'Are you sure?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    dispatch(clearDraft());
                    navigation.navigate('Home');
                  },
                },
              ])
            }
          />
        </View>
      ),
      headerRight: () => (
        <NativeButton
          title="Next"
          onPress={() => {
            dispatch(updateDraft({ name }));
            navigation.navigate('Time and Location');
          }}
        />
      ),
    });
  }, [dispatch, name, navigation]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View flex padding-30>
          <PhotoPicker />
          <Picker
            showSearch
            title="Name"
            value={{ label: name, value: name }}
            onChange={item => setName(item.value)}
            onSearchChange={setQuery}
            listProps={{
              data: filter(names, n => n.text_name.startsWith(query)),
              renderItem: ({ item }) => {
                return (
                  <Picker.Item
                    key={item.id}
                    value={item.text_name}
                    label={item.text_name}
                    disabled={item.deprecated}
                  />
                );
              },
            }}
          />
          <Text>
            The name you would apply to this observation. If you don’t know what
            it is, just leave it blank. If you find a better name in the future,
            you can always propose a name later.
          </Text>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>
              Scientific names are currently required,
            </Text>{' '}
            but do not include any author information. If multiple names apply,
            you will be given the option to select between them. If the name is
            not recognized in the database, then you will be given the option to
            add the name or fix the spelling if it’s just a typo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default NameAndPhotos;
