import React, {useState} from 'react';
import {
  Button,
  Text,
  View,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useActionSheet} from '@expo/react-native-action-sheet';
import styles from '../../styles';

const {width: screenWidth} = Dimensions.get('window');

const Field = props => <View style={styles.field}>{props.children}</View>;
const Row = props => <View style={styles.row}>{props.children}</View>;
const Label = props => (
  <Text style={styles.label} {...props}>
    {props.children}
  </Text>
);

const PhotoPicker = props => {
  const SELECTION_LIMIT = 10;
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState(0);
  const {showActionSheetWithOptions} = useActionSheet();

  const addPhotos = addedPhotos => {
    const newPhotos = photos.concat(addedPhotos);
    setPhotos(newPhotos);
  };

  const removePhoto = () => {
    const newPhotos = photos.filter((_, index) => index !== selected);
    setPhotos(newPhotos);
    if (selected > 0 && selected === newPhotos.length) {
      setSelected(selected - 1);
    }
  };

  const renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={carouselStyles.item}>
        <ParallaxImage
          source={{uri: item.uri}}
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
                        {mediaType: 'photo', saveToPhotos: true},
                        ({assets}) => addPhotos(assets),
                      );
                      break;
                    case 1:
                      launchImageLibrary(
                        {
                          mediaType: 'photo',
                          selectionLimit: SELECTION_LIMIT - photos.length,
                        },
                        ({assets}) => addPhotos(assets),
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
          <Button title="Remove Image" onPress={removePhoto} />
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
