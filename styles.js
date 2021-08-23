/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  field: {
    flex: 1,
    margin: 10,
  },
  label: {
    flexGrow: 1,
    margin: 5,
    fontWeight: 'bold',
    fontSize: 18,
  },
  input: {
    flex: 1,
    margin: 5,
    borderWidth: 1,
    padding: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    textAlignVertical: 'top',
  },
});

export default styles;
