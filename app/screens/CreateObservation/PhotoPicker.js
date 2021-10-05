import React, {useState} from 'react';
import {Button, View, Dimensions, StyleSheet, Platform} from 'react-native';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {useNavigation} from '@react-navigation/core';
import {Field, Row, Label} from '../../components';
import {useKey} from '../../hooks/useAuth';
import {usePostImageMutation} from '../../store/mushroomObserver';

const {width: screenWidth} = Dimensions.get('window');

const PhotoPicker = props => {
  const key = useKey();
  const navigation = useNavigation();

  const SELECTION_LIMIT = 10;
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const [postImage, {data, isLoading}] = usePostImageMutation();

  const addPhotos = async ({didCancel, assets}) => {
    if (!didCancel) {
      const newPhotos = photos.concat(assets);
      console.log(assets[0]);
      const {uri, type, fileSize, fileName} = assets[0];
      console.log(assets[0]);
      postImage({uri, name: fileName, length: fileSize, type, key});
      setPhotos(newPhotos);
    }
  };

  console.log(data);
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

  const renderItem = ({item}, parallaxProps) => {
    return (
      <View style={carouselStyles.item}>
        <ParallaxImage
          source={{uri: item?.uri}}
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
      <Field>
        <Row>
          <Label>Photos</Label>
          <Button
            title="Add Photos"
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
        </Row>
      </Field>
      {photos.length > 0 && (
        <View style={carouselStyles.container}>
          <Carousel
            sliderWidth={screenWidth}
            sliderHeight={300}
            itemWidth={screenWidth - 60}
            data={photos}
            renderItem={renderItem}
            hasParallaxImages={true}
            onSnapToItem={setSelected}
          />
          <View style={carouselStyles.buttonContainer}>
            <Button title="Remove" onPress={removePhoto} />
            <Button title="Edit" onPress={editPhoto} />
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
    width: screenWidth - 60,
    height: 300,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
});
