import DraftPhoto from '../../components/DraftPhoto';
import { selectById } from '../../store/draftObservations';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Dimensions } from 'react-native';
import { Carousel, Chip, Colors, View } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

const { width: screenWidth } = Dimensions.get('window');

interface PhotoCarouselProps {
  draftPhotoIds: string[];
  onRemovePhoto: Function;
}

interface PhotoProps extends PropsFromRedux {
  id: string;
  onRemovePhoto: Function;
}

const Photo = ({ id, onRemovePhoto }: PhotoProps) => {
  const navigation = useNavigation();
  return (
    <View flex center>
      <DraftPhoto
        id={id}
        key={id}
        width={screenWidth - 40}
        height={280}
        borderRadius={11}
      />
      <View
        absB
        flex
        row
        spread
        padding-5
        width={screenWidth - 40}
        style={{
          borderBottomLeftRadius: 11,
          borderBottomRightRadius: 11,
          backgroundColor: Colors.rgba(Colors.white, 0.5),
        }}
      >
        <Chip
          backgroundColor={Colors.white}
          label="Remove"
          onPress={() => onRemovePhoto(id)}
          labelStyle={{ color: Colors.white }}
          containerStyle={{
            borderColor: Colors.red20,
            backgroundColor: Colors.red20,
          }}
        />
        <Chip
          backgroundColor={Colors.white}
          label="Edit"
          onPress={() =>
            navigation.navigate('Create Photo', {
              id,
            })
          }
          labelStyle={{ color: Colors.white }}
          containerStyle={{
            borderColor: Colors.primary,
            backgroundColor: Colors.primary,
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  draftObservation: selectById(state, ownProps.id),
});

const connector = connect(mapStateToProps);

const ConnectedPhoto = connector(Photo);

type PropsFromRedux = ConnectedProps<typeof connector>;

const PhotoCarousel = ({
  draftPhotoIds,
  onRemovePhoto,
}: PhotoCarouselProps) => {
  return (
    <Carousel
      horizontal
      allowAccessibleLayout
      pageControlPosition={Carousel.pageControlPositions.OVER}
      pageControlProps={{
        color: Colors.primary,
        inactiveColor: Colors.grey30,
      }}
    >
      {draftPhotoIds.map(id => (
        <ConnectedPhoto
          key={id}
          id={id}
          onRemovePhoto={() => onRemovePhoto(id)}
        />
      ))}
    </Carousel>
  );
};

export default PhotoCarousel;
