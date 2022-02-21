import React, { useState } from 'react';
import {
  TextField,
  Colors,
  Text,
  View,
  Incubator,
  Typography,
  Spacings,
} from 'react-native-ui-lib';

interface NotesFieldProps {
  placeholder: string;
  notes: string | undefined;
  onChangeNotes: (text: string) => void;
}

export const NotesField = ({
  placeholder,
  notes,
  onChangeNotes,
}: NotesFieldProps) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View>
      <Incubator.TextField
        preset="default"
        label="Notes"
        style={{
          ...Typography.text80,
        }}
        textAlignVertical="top"
        value={notes}
        onChangeText={onChangeNotes}
        placeholder={placeholder}
        multiline
        height={Typography.text80?.lineHeight * 16}
        showCharCounter
        maxLength={1000}
      />
    </View>
  );
};
