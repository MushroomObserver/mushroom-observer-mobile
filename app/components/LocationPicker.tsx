import { Location, selectAll } from '../store/locations';
import { filter, lowerCase, orderBy } from 'lodash';
import React, { useState } from 'react';
import { Picker } from 'react-native-ui-lib';
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
    <Picker
      showSearch
      title="Location"
      value={{ label: location, value: location }}
      onChange={onChangeLocation}
      onSearchChange={setQuery}
      topBarProps={{ title: 'Location' }}
      searchPlaceholder={'Search locations'}
      validateOnStart
      validateOnChange
      validateOnBlur
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
      validate="required"
      errorMessage="This field is required"
    />
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  locations: selectAll(state),
});

const connector = connect(mapStateToProps);

const ConnectedLocationPicker = connector(LocationPicker);

export default ConnectedLocationPicker;
