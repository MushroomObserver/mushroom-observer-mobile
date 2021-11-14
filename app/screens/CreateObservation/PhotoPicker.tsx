import { useKey } from '../../hooks/useAuth';
import { usePostImageMutation } from '../../store/mushroomObserver';
import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import {
  Callback,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { Button, GridView, View } from 'react-native-ui-lib';

const { width: screenWidth } = Dimensions.get('window');

const PhotoPicker = () => {
  const SELECTION_LIMIT = 12;
  const key = useKey();
  const [photos, setPhotos] = useState([]);
  const { showActionSheetWithOptions } = useActionSheet();
  const [
    postImage, // This is the mutation trigger
    result, // This is the destructured mutation result
  ] = usePostImageMutation();

  const addPhotos: Callback = async ({
    didCancel,
    assets,
  }: ImagePickerResponse) => {
    if (!didCancel) {
      const newPhotos = photos.concat(assets);
      postImage({
        uri: assets[0].uri,
        name: assets[0].fileName,
        type: assets[0].type,
        key,
      });
      setPhotos(newPhotos);
    }
  };
  console.log(result?.data?.errors);
  return (
    <View flexG>
      {photos.length > 0 && (
        <View marginB-15>
          <GridView
            items={photos.map((photo, index) => ({
              index,
              imageProps: {
                source: photo,
              },
              onPress: value => {
                console.log(value);
              },
            }))}
            viewWidth={screenWidth - 60}
            numColumns={3}
          />
        </View>
      )}
      <Button
        marginB-15
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
                    },
                    addPhotos,
                  );
                  break;
                case 1:
                  launchImageLibrary(
                    {
                      mediaType: 'photo',
                      selectionLimit: SELECTION_LIMIT - photos.length,
                    },
                    addPhotos,
                  );
                  break;
                default:
                  break;
              }
            },
          )
        }
        disabled={photos && photos.length === SELECTION_LIMIT}
      />
    </View>
  );
};

export default PhotoPicker;