import { useKey } from '../hooks/useAuth';
import { addImages, selectById } from '../store/images';
import { useGetImagesQuery } from '../store/mushroomObserver';
import { Image as ImageType } from '../types/store';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Card as UICard, Colors } from 'react-native-ui-lib';
import { connect, useDispatch } from 'react-redux';

interface PhotoProps {
  id: number | string;
  photo?: ImageType;
  width: number;
  height: number;
  onPress?: Function;
}

const Photo = ({ id, photo, width, height }: PhotoProps) => {
  return (
    <UICard
      row
      height={160}
      style={{ marginBottom: 15 }}
      onPress={() => {}}
      borderRadius={5}
      useNative
      backgroundColor={Colors.white}
      activeOpacity={1}
    >
      <UICard.Image />
    </UICard>
  );
};

const mapStateToProps = (state: any, ownProps: PhotoProps) => ({
  photo: selectById(state, ownProps.id),
});

export default connect(mapStateToProps)(Photo);
