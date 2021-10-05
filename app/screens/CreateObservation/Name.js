import React, {useLayoutEffect, useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import {Field, Label, Sublabel, Input} from '../../components';
import {useDispatch, useSelector} from 'react-redux';
import {clearDraft, selectDraft, updateDraft} from '../../store/draft';
import FilteredList from '../../components/FilteredList';
import {selectAll} from '../../store/names';

const NameAndPhotos = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const draft = useSelector(selectDraft);
  const names = useSelector(selectAll);
  const [name, setName] = useState(draft.name);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View>
          <Button
            title="Clear"
            onPress={() =>
              Alert.alert('Clear', 'Are you sure?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => dispatch(clearDraft()),
                },
              ])
            }
          />
        </View>
      ),
      headerRight: () => (
        <Button
          title="Next"
          onPress={() => {
            dispatch(updateDraft({name}));
            navigation.navigate('Time and Location');
          }}
        />
      ),
    });
  }, [dispatch, name, navigation]);

  return (
    <View style={{flex: 1}}>
      <Field>
        <Label>Name</Label>
        <Input value={name} onChangeText={setName} />
        <Sublabel>
          The name you would apply to this observation. If you don’t know what
          it is, just leave it blank. If you find a better name in the future,
          you can always propose a name later.
        </Sublabel>
        <Sublabel>
          <Text style={{fontWeight: 'bold'}}>
            Scientific names are currently required,
          </Text>
          but do not include any author information. If multiple names apply,
          you will be given the option to select between them. If the name is
          not recognized in the database, then you will be given the option to
          add the name or fix the spelling if it’s just a typo.
        </Sublabel>
      </Field>
      <FilteredList
        data={names}
        property="text_name"
        query={name}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Text>
            {item.text_name} {item.author}
          </Text>
        )}
      />
    </View>
  );
};

export default NameAndPhotos;
