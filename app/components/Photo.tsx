import { selectById } from '../store/images';
import { Image as ImageType } from '../types/store';
import React from 'react';
import Config from 'react-native-config';
import { Image } from 'react-native-ui-lib';
import { connect } from 'react-redux';

interface PhotoProps {
  id: string;
  photo?: ImageType;
  width: number;
  height: number;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomRightRadius?: number;
  borderBottomLeftRadius?: number;
  onPress?: Function;
}

const Photo = ({
  photo,
  width,
  height,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
}: PhotoProps) => {
  const getPhotoUri = (uri: string) => {
    if (__DEV__)
      return uri.replace(
        'http://images.mushroomobserver.org',
        Config.MUSHROOM_OBSERVER_API_URL + '/images',
      );
    return uri;
  };

  return (
    <Image
      style={{
        resizeMode: 'cover',
        width,
        height,
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
      }}
      resizeMethod="auto"
      source={{ uri: getPhotoUri(photo?.files[1]) }}
    />
  );
};

const mapStateToProps = (state: any, ownProps: PhotoProps) => ({
  photo: selectById(state, ownProps.id),
});

export default connect(mapStateToProps)(Photo);
