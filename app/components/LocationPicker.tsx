import { Location, selectAll } from '../store/locations';
import { filter, lowerCase } from 'lodash';
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
      listProps={{
        data: filter(locations, ({ name }) =>
          lowerCase(name).includes(lowerCase(query)),
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
