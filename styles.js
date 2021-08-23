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
    justifyContent: 'space-between',
  },
  field: {
    flex: 1,
    margin: 10,
  },
  label: {
    margin: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  sublabel: {
    margin: 5,
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
