import { Name, selectAll } from '../store/names';
import { filter, lowerCase, sortBy } from 'lodash';
import React, { useState } from 'react';
import {
  Button,
  Colors,
  Incubator,
  Picker,
  Text,
  View,
} from 'react-native-ui-lib';
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
    <View>
      <Picker
        migrate
        migrateTextField
        title="Name"
        label="Name"
        renderPicker={(selectedItem: string, itemLabel: string) => {
          return (
            <Incubator.TextField
              preset="default"
              label="Name"
              value={selectedItem}
            />
          );
        }}
        showSearch
        searchPlaceholder={'Search names'}
        searchStyle={{
          color: Colors.black,
          placeholderTextColor: Colors.grey40,
        }}
        onSearchChange={setQuery}
        value={name}
        onChange={onChangeName}
        topBarProps={{ title: 'Name' }}
        listProps={{
          data: filter(sortedNames, ({ text_name }) =>
            lowerCase(text_name).startsWith(lowerCase(query)),
          ),
          renderItem: ({ item }: { item: Name }) => {
            return (
              <Picker.Item
                key={item.text_name + ' ' + item.author}
                value={item.text_name + ' ' + item.author}
                label={item.text_name + ' ' + item.author}
              />
            );
          },
        }}
      />
      <View flex>
        <View right marginB-s2>
          <Button
            disabled={!name}
            size={Button.sizes.xSmall}
            label="Clear"
            onPress={() => {
              onChangeName();
            }}
          />
        </View>
        <Text>
          The name you would apply to this observation. If you don’t know what
          it is, just leave it blank. If you find a better name in the future,
          you can always propose a name later.
        </Text>
      </View>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  names: selectAll(state),
});

const connector = connect(mapStateToProps);

export default connector(NamePicker);
