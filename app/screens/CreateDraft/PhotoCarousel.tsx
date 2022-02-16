import DraftPhoto from '../../components/DraftPhoto';
import useDayjs from '../../hooks/useDayjs';
import { selectById } from '../../store/draftImages';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Dimensions } from 'react-native';
import { Carousel, Chip, Colors, Text, View } from 'react-native-ui-lib';
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

const Photo = ({ id, draftPhoto, onRemovePhoto }: PhotoProps) => {
  const navigation = useNavigation();
  const dayjs = useDayjs();
  console.log(draftPhoto);
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
        absT
        flex
        padding-5
        width={screenWidth - 40}
        style={{
          borderTopLeftRadius: 11,
          borderTopRightRadius: 11,
          backgroundColor: Colors.rgba(Colors.white, 0.7),
        }}
      >
        <View padding-5>
          <View row spread>
            <Text>Latitude: {draftPhoto?.latitude?.toPrecision(4)}</Text>
            <Text>
              Longitude:
              {draftPhoto?.longitude?.toPrecision(4)}
            </Text>
            <Text>
              Altitude:
              {draftPhoto?.altitude?.toPrecision(4)}
            </Text>
          </View>
          <View row spread>
            <Text>Date: {dayjs(draftPhoto?.date).format('ll')}</Text>
          </View>
        </View>
        {false && (
          <View centerV row spread>
            <Chip
              backgroundColor={Colors.white}
              label="Use GPS"
              onPress={() => onRemovePhoto(id)}
              labelStyle={{ color: Colors.white }}
              containerStyle={{
                borderColor: Colors.yellow20,
                backgroundColor: Colors.yellow20,
              }}
            />
            <Chip
              backgroundColor={Colors.white}
              label="Use Date"
              onPress={() => onRemovePhoto(id)}
              labelStyle={{ color: Colors.white }}
              containerStyle={{
                borderColor: Colors.yellow20,
                backgroundColor: Colors.yellow20,
              }}
            />
          </View>
        )}
      </View>
      <View
        absB
        flex
        padding-5
        width={screenWidth - 40}
        style={{
          borderBottomLeftRadius: 11,
          borderBottomRightRadius: 11,
          backgroundColor: Colors.rgba(Colors.white, 0.7),
        }}
      >
        <View row spread>
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
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: any) => ({
  draftPhoto: selectById(state, ownProps.id),
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
