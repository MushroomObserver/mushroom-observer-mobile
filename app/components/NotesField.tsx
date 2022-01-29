import React from 'react';
import { Text, TextField, View } from 'react-native-ui-lib';

interface NotesFieldProps {
  notes: string | undefined;
  onChangeNotes: Function;
}

export const NotesField = ({ notes, onChangeNotes }: NotesFieldProps) => {
  return (
    <View flex>
      <TextField
        title="Notes"
        value={notes}
        onChangeText={onChangeNotes}
        expandable
        multiline
      />
      <Text>
        Please include any additional information you can think of about this
        observation that isn’t clear from the photographs, e.g., habitat,
        substrate or nearby trees; distinctive texture, scent, taste, staining
        or bruising; results of chemical or microscopic analyses, etc.
      </Text>
    </View>
  );
};
