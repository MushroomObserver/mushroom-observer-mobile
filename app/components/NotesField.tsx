import React from 'react';
import { Text, TextField, View } from 'react-native-ui-lib';

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
    <TextField
      title="Notes"
      value={notes}
      onChangeText={onChangeNotes}
      placeholder={placeholder}
      expandable
      multiline
      autoFocus
    />
  );
};
