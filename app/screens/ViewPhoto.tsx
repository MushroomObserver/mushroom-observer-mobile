import { useKey } from '../hooks/useAuth';
import { addImages, selectById } from '../store/images';
import { useGetImagesQuery } from '../store/mushroomObserver';
import { ForwardedViewPhotoProps } from '../types/navigation';
import { Image as ImageType } from '../types/store';
import { useNavigation, useRoute } from '@react-navigation/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useEffect, useLayoutEffect } from 'react';
import { Button as NativeButton, Dimensions, ScrollView } from 'react-native';
import { GridView, Image, Text, View } from 'react-native-ui-lib';
import { withForwardedNavigationParams } from 'react-navigation-props-mapper';
import { connect, useDispatch } from 'react-redux';

dayjs.extend(LocalizedFormat);

interface ViewPhotoProps {
  id: number;
  photo: ImageType;
}

const { width: screenWidth } = Dimensions.get('window');

const ViewPhoto = ({ id, photo }: ViewPhotoProps) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const apiKey = useKey();

  const { data, isLoading } = useGetImagesQuery({
    api_key: apiKey,
    id,
    detail: 'high',
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      dispatch(addImages(data.results));
    }
  });
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <NativeButton
          title="Edit"
          onPress={() => navigation.navigate('Edit Photo', { id })}
        />
      ),
    });
  }, [navigation, route]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic"></ScrollView>
    </View>
  );
};

const mapStateToProps = (state: any, ownProps: ViewPhotoProps) => ({
  photo: selectById(state, ownProps.id),
});

const ConnectedViewPhoto = connect(mapStateToProps)(ViewPhoto);

export default withForwardedNavigationParams<ForwardedViewPhotoProps>()(
  ConnectedViewPhoto,
);
