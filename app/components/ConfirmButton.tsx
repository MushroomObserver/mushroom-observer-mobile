import React from 'react';
import { Alert, Button } from 'react-native';

interface ConfirmButtonProps {
  buttonTitle: string;
  alertTitle: string;
  alertMessage: string;
  onConfirm: () => void;
}

const ConfirmButton = ({
  buttonTitle,
  alertTitle,
  alertMessage,
  onConfirm,
}: ConfirmButtonProps) => {
  return (
    <Button
      title={buttonTitle}
      onPress={() =>
        Alert.alert(alertTitle, alertMessage, [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: onConfirm,
          },
        ])
      }
    />
  );
};

export default ConfirmButton;
