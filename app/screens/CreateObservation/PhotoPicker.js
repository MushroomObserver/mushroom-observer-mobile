import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/core';
import { map } from 'lodash-es';
import React, { useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Button, Carousel, Image, View } from 'react-native-ui-lib';

import { useKey } from '../../hooks/useAuth';
import { usePostImageMutation } from '../../store/mushroomObserver';

const { width: screenWidth } = Dimensions.get('window');

const PhotoPicker = props => {
  const key = useKey();
  const navigation = useNavigation();

  const SELECTION_LIMIT = 10;
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(0);
  const { showActionSheetWithOptions } = useActionSheet();
  const viewRef = useRef();

  const [postImage, { data, isLoading }] = usePostImageMutation();

  const addPhotos = async ({ didCancel, assets }) => {
    if (!didCancel) {
      const newPhotos = photos.concat(assets);
      setPhotos(newPhotos);
    }
  };

  const removePhoto = () => {
    const newPhotos = photos.filter((_, index) => index !== selected);
    setPhotos(newPhotos);
    if (selected > 0 && selected === newPhotos.length) {
      setSelected(selected - 1);
    }
  };

  const editPhoto = () => {
    navigation.navigate('Edit Photo', photos[selected]);
  };

  return (
    <View flexG ref={viewRef}>
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

      <Carousel
        pageWidth={screenWidth}
        containerStyle={{ height: 250 }}
        pageControlPosition={Carousel.pageControlPositions.OVER}
        allowAccessibleLayout>
        {photos &&
          map(photos, (item, index) => (
            <View flex centerV key={index}>
              <Image
                overlayType={Image.overlayTypes.BOTTOM}
                style={{ flex: 1 }}
                source={{
                  uri: item.uri,
                }}
              />
            </View>
          ))}
      </Carousel>

      <View style={carouselStyles.buttonContainer}>
        <Button outline label="Remove" onPress={removePhoto} />
        <Button outline label="Edit" onPress={editPhoto} />
      </View>
    </View>
  );
};

export default PhotoPicker;

const carouselStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    height: 300,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});
