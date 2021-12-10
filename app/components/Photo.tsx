import { useKey } from '../hooks/useAuth';
import { addImages, selectById } from '../store/images';
import { useGetImagesQuery } from '../store/mushroomObserver';
import { Image as ImageType } from '../types/store';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ProgressiveImage, View } from 'react-native-ui-lib';
import { connect, useDispatch } from 'react-redux';

interface PhotoProps {
  id: number | string;
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
  id,
  photo,
  width,
  height,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
}: PhotoProps) => {
  const dispatch = useDispatch();
  const apiKey = useKey();

  const { data, isLoading, error } = useGetImagesQuery({
    api_key: apiKey,
    id: `${id}`,
    detail: 'high',
  });

  useEffect(() => {
    if (data) {
      dispatch(addImages(data.results));
    }
  });

  return isLoading ? (
    <View center style={{ width, height }}>
      <ActivityIndicator />
    </View>
  ) : (
    <ProgressiveImage
      animationDuration={500}
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
      loader={<ActivityIndicator />}
      thumbnailSource={{ uri: photo?.files[0] }}
      source={{ uri: photo?.files[1] }}
    />
  );
};

const mapStateToProps = (state: any, ownProps: PhotoProps) => ({
  photo: selectById(state, ownProps.id),
});

export default connect(mapStateToProps)(Photo);
