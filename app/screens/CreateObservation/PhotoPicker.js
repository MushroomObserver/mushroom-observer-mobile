import { useActionSheet } from '@expo/react-native-action-sheet';
import { map } from 'lodash-es';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Button, Carousel, GridView, Image, View } from 'react-native-ui-lib';

const { width: screenWidth } = Dimensions.get('window');

const PhotoPicker = () => {
  const SELECTION_LIMIT = 12;
  const [photos, setPhotos] = useState([]);
  const { showActionSheetWithOptions } = useActionSheet();

  const addPhotos = async ({ didCancel, assets }) => {
    if (!didCancel) {
      const newPhotos = photos.concat(assets);
      setPhotos(newPhotos);
    }
  };

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
