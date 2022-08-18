import { Location, selectAll } from '../store/locations';
import { filter, lowerCase, orderBy } from 'lodash';
import React, { useState } from 'react';
import { Button, Colors, Incubator, Picker, View } from 'react-native-ui-lib';
import { connect } from 'react-redux';

interface LocationPickerProps {
  location: string;
  locations: Location[];
  onChangeLocation: Function;
}

const LocationPicker = ({
  location,
  locations,
  onChangeLocation,
}: LocationPickerProps) => {
  const [query, setQuery] = useState('');

  return (
    <View>
      <Picker
        migrate
        migrateTextField
        renderPicker={(selectedItem: string, itemLabel: string) => {
          return (
            <Incubator.TextField
              preset="default"
              label="Location"
              value={selectedItem}
            />
          );
        }}
        showSearch
        searchPlaceholder={'Search locations'}
        searchStyle={{
          color: Colors.black,
          placeholderTextColor: Colors.grey40,
        }}
        title="Location"
        value={location}
        onChange={onChangeLocation}
        onSearchChange={setQuery}
        topBarProps={{ title: 'Location' }}
        listProps={{
          data: orderBy(
            filter(locations, ({ name }) =>
              lowerCase(name).includes(lowerCase(query)),
            ),
            [({ name }) => name.toLowerCase()],
            ['asc'],
          ),
          renderItem: ({ item }: { item: Location }) => (
            <Picker.Item key={item.id} value={item.name} label={item.name} />
          ),
        }}
      />
      <View flex>
        <View right marginB-s2>
          <Button
            disabled={!location}
            size={Button.sizes.xSmall}
            label="Clear"
            onPress={() => {
              onChangeLocation();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  locations: selectAll(state),
});

const connector = connect(mapStateToProps);

const ConnectedLocationPicker = connector(LocationPicker);

export default ConnectedLocationPicker;
