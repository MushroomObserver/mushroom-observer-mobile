import React, { useState } from 'react';
import { Text, Incubator, View } from 'react-native-ui-lib';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface NotesFieldProps {
  placeholder: string;
  notes: string | undefined;
  onChangeNotes: Function;
}

export const NotesField = ({
  placeholder,
  notes,
  onChangeNotes,
}: NotesFieldProps) => {
  return (
    <Incubator.TextField
      label="Notes"
      value={notes}
      onChange={onChangeNotes}
      color={Colors.textColor}
      placeholder={placeholder}
      expandable
      multiline
      textAlignVertical="top"
      numberOfLines={7}
    />
  );
};
