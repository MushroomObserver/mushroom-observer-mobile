import React, { useState } from 'react';
import { TextField, Colors, Text, View } from 'react-native-ui-lib';

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
    <View>
      <TextField
        title="Notes"
        value={notes}
        color={Colors.black}
        onChangeText={onChangeNotes}
        placeholder={expanded ? placeholder : undefined}
        placeholderTextColor={Colors.grey40}
        onToggleExpandableModal={setExpanded}
        expandable
        multiline
        autoFocus
      />
      <Text>{placeholder}</Text>
    </View>
  );
};
