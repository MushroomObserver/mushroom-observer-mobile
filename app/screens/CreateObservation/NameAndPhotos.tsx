import {
  selectById,
  updateDraftObservation as updateDraftObservationAction,
  removeDraftObservation as removeDraftObservationAction,
} from '../../store/draftObservations';
import { selectAll } from '../../store/names';
import { ForwardedNameAndPhotosProps } from '../../types/navigation';
import PhotoPicker from './PhotoPicker';
import { useNavigation } from '@react-navigation/core';
import { filter } from 'lodash-es';
import React, { useLayoutEffect, useState } from 'react';
import { Alert, Button as NativeButton, ScrollView } from 'react-native';
import { Picker, Text, View } from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, ConnectedProps, useDispatch, useSelector } from 'react-redux';

interface NameAndPhotosProps extends PropsFromRedux {
  id: string;
  draftObservation: any;
}

const NameAndPhotos = ({
  id,
  draftObservation,
  updateDraftObservation,
  removeDraftObservation,
}: NameAndPhotosProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [name, setName] = useState(draftObservation?.name);
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
                    removeDraftObservation(id);
                    navigation.navigate('Home', { screen: 'My Observations' });
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
            updateDraftObservation({ ...draftObservation, name });
            navigation.navigate('Time and Location', { id });
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
            onChange={item => {
              setName(item.value);
            }}
            onSearchChange={setQuery}
            searchPlaceholder={query}
            listProps={{
              data: filter(names, n => n.text_name.startsWith(query)),
              renderItem: ({ item }) => {
                return (
                  <Picker.Item
                    key={item.id}
                    value={item.text_name + ' ' + item.author}
                    label={item.text_name + ' ' + item.author}
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

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservation: selectById(state, ownProps.id),
});

const mapDispatchToProps = {
  updateDraftObservation: updateDraftObservationAction,
  removeDraftObservation: removeDraftObservationAction,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

const ConnectedNameAndPhotos = connector(NameAndPhotos);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default withForwardedNavigationParams<ForwardedNameAndPhotosProps>()(
  ConnectedNameAndPhotos,
);
