import React, { useState } from 'react';
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
  const [expanded, setExpanded] = useState(false);
  return (
    <TextField
      title="Notes"
      value={notes}
      onChangeText={onChangeNotes}
      placeholder={expanded ? placeholder : undefined}
      onToggleExpandableModal={setExpanded}
      expandable
      multiline
      autoFocus
    />
  );
};
