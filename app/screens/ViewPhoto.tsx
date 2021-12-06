import { useKey } from '../hooks/useAuth';
import { addImages, selectById } from '../store/images';
import { useGetImagesQuery } from '../store/mushroomObserver';
import { ForwardedViewPhotoProps } from '../types/navigation';
import { Image as ImageType } from '../types/store';
import { useNavigation, useRoute } from '@react-navigation/core';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useEffect, useLayoutEffect } from 'react';
import {
  Alert,
  Button as NativeButton,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Image, Text, View } from 'react-native-ui-lib';
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

  const { data, isLoading, error } = useGetImagesQuery({
    api_key: apiKey,
    id,
    detail: 'high',
  });

  useEffect(() => {
    if (data) {
      dispatch(addImages(data.results));
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Photo #${id}`,
      headerRight: () => (
        <>
          <NativeButton
            title="Edit"
            onPress={() => navigation.navigate('Edit Photo', { id })}
          />
        </>
      ),
    });
  }, [navigation, route]);

  return (
    <View flex>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View padding-15>
          <Image
            marginB-15
            width="100%"
            height={220}
            resizeMethod="auto"
            source={{
              uri: `https://mushroomobserver.org/images/320/${id}.jpg`,
            }}
          />
          {photo && (
            <View>
              <Text text70H>
                Date: <Text text70>{dayjs(photo.date).format('ll')}</Text>
              </Text>
              <Text text70H>
                Owner: <Text text70>{photo.owner.login_name}</Text>
              </Text>
              <Text text70H>
                License: <Text text70>{photo.license}</Text>
              </Text>
            </View>
          )}
          {photo?.notes && (
            <Text text70H>
              License: <Text text70>{photo.license}</Text>
            </Text>
          )}
        </View>
      </ScrollView>
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
