import { useActionSheet } from '@expo/react-native-action-sheet';
import React from 'react';
import {
  Callback,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Button } from 'react-native-ui-lib';

interface AddPhotosButtonProps {
  callback: Callback;
  numPhotos: number;
  maxPhotos: number;
}

const AddPhotosButton = ({
  callback,
  numPhotos,
  maxPhotos,
}: AddPhotosButtonProps) => {
  const { showActionSheetWithOptions } = useActionSheet();
  return (
    <Button
      label="Add Photos"
      size={Button.sizes.medium}
      onPress={() =>
        showActionSheetWithOptions(
          {
            options: ['Camera', 'Gallery', 'Cancel'],
            cancelButtonIndex: 2,
          },
          selectedIndex => {
            switch (selectedIndex) {
              case 0:
                launchCamera(
                  {
                    mediaType: 'photo',
                    saveToPhotos: true,
                    includeExtra: true,
                  },
                  callback,
                );
                break;
              case 1:
                launchImageLibrary(
                  {
                    mediaType: 'photo',
                    selectionLimit: maxPhotos - numPhotos,
                    includeExtra: true,
                  },
                  callback,
                );
                break;
              default:
                break;
            }
          },
        )
      }
      disabled={maxPhotos === numPhotos}
    />
  );
};

export default AddPhotosButton;
