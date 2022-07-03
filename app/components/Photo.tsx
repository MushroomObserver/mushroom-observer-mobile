import getImageUri from '../hooks/useGetImageUri';
import { selectById } from '../store/images';
import { Image as ImageType } from '../types/store';
import React from 'react';
import Config from 'react-native-config';
import { Image, ImageProps } from 'react-native-ui-lib';
import { connect } from 'react-redux';

interface PhotoProps extends ImageProps {
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
  ...props
}: PhotoProps) => {
  return (
    <Image
      {...props}
      style={{
        width,
        height,
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
      }}
      resizeMethod="auto"
      source={{ uri: getImageUri(photo?.files[1]) }}
    />
  );
};

const mapStateToProps = (state: any, ownProps: PhotoProps) => ({
  photo: selectById(state, ownProps.id),
});

export default connect(mapStateToProps)(Photo);
