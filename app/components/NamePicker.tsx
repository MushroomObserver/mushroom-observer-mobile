import { Name, selectAll } from '../store/names';
import { filter, lowerCase, sortBy } from 'lodash';
import React, { useState } from 'react';
import { Picker } from 'react-native-ui-lib';
import { connect } from 'react-redux';

interface NamePickerProps {
  name: string | undefined;
  onChangeName: Function;
  names: Name[];
}

const NamePicker = ({ name, names, onChangeName }: NamePickerProps) => {
  const sortedNames = sortBy(names, ['text_name', 'author']);
  const [query, setQuery] = useState('');

  return (
    <Picker
      showSearch
      title="Name"
      label="Name"
      value={{ label: name, value: name }}
      onChange={onChangeName}
      onSearchChange={setQuery}
      topBarProps={{ title: 'Name' }}
      searchPlaceholder={'Search names'}
      listProps={{
        data: filter(
          sortedNames,
          ({ text_name, author }) =>
            lowerCase(text_name).includes(lowerCase(query)) ||
            lowerCase(author).includes(lowerCase(query)),
        ),
        renderItem: ({ item }: { item: Name }) => {
          return (
            <Picker.Item
              key={item.id}
              value={item.text_name + ' ' + item.author}
              label={item.text_name + ' ' + item.author}
            />
          );
        },
      }}
    />
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  names: selectAll(state),
});

const connector = connect(mapStateToProps);

export default connector(NamePicker);
