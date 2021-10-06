import { useActionSheet } from '@expo/react-native-action-sheet';
import { map } from 'lodash-es';
import React, { useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Button, Carousel, Image, View } from 'react-native-ui-lib';

const { width: screenWidth } = Dimensions.get('window');

const PhotoPicker = () => {
  const SELECTION_LIMIT = 10;
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
        <Carousel
          pageWidth={screenWidth}
          containerStyle={{ height: 250 }}
          pageControlPosition={Carousel.pageControlPositions.UNDER}
          allowAccessibleLayout>
          {photos &&
            map(photos, (item, index) => (
              <Image
                key={index}
                overlayType={Image.overlayTypes.BOTTOM}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  resizeMode: 'cover',
                }}
                source={{
                  uri: item.uri,
                }}
              />
            ))}
        </Carousel>
      )}
      <Button
        label="Add Photos"
        outline
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
