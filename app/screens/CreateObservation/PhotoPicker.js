import { useActionSheet } from '@expo/react-native-action-sheet';
import { useNavigation } from '@react-navigation/core';
import React, { useState } from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Button, GridView, Image, View } from 'react-native-ui-lib';

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

  const renderItem = ({ item }, parallaxProps) => {
    return (
      <View style={carouselStyles.item}>
        <Image
          aspectRatio={1}
          source={{ uri: item?.uri }}
          resizeMode="contain"
          containerStyle={carouselStyles.imageContainer}
          style={carouselStyles.image}
          {...parallaxProps}
        />
      </View>
    );
  };

  return (
    <View>
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
      {photos.length > 0 && (
        <View>
          <GridView
            numColumns={4}
            keepItemSize
            viewWidth={300}
            items={photos.map(photo => {
              console.log(photo);
              return {
                imageProps: {
                  source: { uri: photo.uri },
                },
                itemSize: { height: 90 },
                title: 'Title',
                subtitle: 'subtitle',
                description: 'smtg',
                descriptionLines: 2,
                alignToStart: true,
              };
            })}
          />
          <View style={carouselStyles.buttonContainer}>
            <Button outline label="Remove" onPress={removePhoto} />
            <Button outline label="Edit" onPress={editPhoto} />
          </View>
        </View>
      )}
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
